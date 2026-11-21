from fastapi import WebSocket
from typing import Dict, List, Optional, Any
import logging

logger = logging.getLogger("websockets")

class ConnectionManager:
    def __init__(self):
        # Chat channels: channel_id -> list of active WebSockets
        self.active_connections: Dict[str, List[WebSocket]] = {}
        # Meeting rooms: room_id -> dict of peer_id -> {"ws": WebSocket, "user": dict}
        self.meeting_rooms: Dict[str, Dict[str, Dict[str, Any]]] = {}

    # ─── Chat WebSocket Methods ──────────────────────────────────────────
    async def connect(self, channel_id: str, websocket: WebSocket):
        await websocket.accept()
        if channel_id not in self.active_connections:
            self.active_connections[channel_id] = []
        self.active_connections[channel_id].append(websocket)

    def disconnect(self, channel_id: str, websocket: WebSocket):
        if channel_id in self.active_connections:
            if websocket in self.active_connections[channel_id]:
                self.active_connections[channel_id].remove(websocket)
            if not self.active_connections[channel_id]:
                del self.active_connections[channel_id]

    async def broadcast(self, channel_id: str, message: dict):
        if channel_id in self.active_connections:
            dead_connections = []
            for connection in list(self.active_connections[channel_id]):
                try:
                    await connection.send_json(message)
                except Exception:
                    dead_connections.append(connection)
            for dead in dead_connections:
                if dead in self.active_connections.get(channel_id, []):
                    self.active_connections[channel_id].remove(dead)

    # ─── Meeting & Video Consultation Methods ────────────────────────────
    async def join_meeting(
        self,
        room_id: str,
        peer_id: str,
        user_info: dict,
        websocket: WebSocket,
        agenda: Optional[list] = None
    ):
        await websocket.accept()
        if room_id not in self.meeting_rooms:
            self.meeting_rooms[room_id] = {}
        
        self.meeting_rooms[room_id][peer_id] = {
            "ws": websocket,
            "user": user_info,
            "peer_id": peer_id
        }

        # Gather current participants list
        participants = [
            {"peer_id": pid, **data["user"]}
            for pid, data in self.meeting_rooms[room_id].items()
        ]

        # Send existing participant roster to new joiner
        try:
            await websocket.send_json({
                "type": "room_state",
                "room_id": room_id,
                "your_peer_id": peer_id,
                "participants": participants,
                "agenda": agenda or []
            })
        except Exception as e:
            logger.warning(f"Error sending room_state to {peer_id}: {e}")

        # Broadcast new peer announcement to other peers in room
        await self.broadcast_to_meeting(
            room_id=room_id,
            message={
                "type": "peer_joined",
                "peer_id": peer_id,
                "user": user_info,
                "participants": participants
            },
            exclude_peer=peer_id
        )

    async def leave_meeting(self, room_id: str, peer_id: str):
        if room_id in self.meeting_rooms and peer_id in self.meeting_rooms[room_id]:
            user_info = self.meeting_rooms[room_id][peer_id].get("user", {})
            del self.meeting_rooms[room_id][peer_id]
            if not self.meeting_rooms[room_id]:
                del self.meeting_rooms[room_id]
            
            # Announce departure to remaining participants
            await self.broadcast_to_meeting(
                room_id=room_id,
                message={
                    "type": "peer_left",
                    "peer_id": peer_id,
                    "user": user_info
                }
            )

    async def broadcast_to_meeting(self, room_id: str, message: dict, exclude_peer: Optional[str] = None):
        if room_id not in self.meeting_rooms:
            return
        
        dead_peers = []
        for pid, data in list(self.meeting_rooms[room_id].items()):
            if exclude_peer and pid == exclude_peer:
                continue
            try:
                await data["ws"].send_json(message)
            except Exception:
                dead_peers.append(pid)
        
        for dead_pid in dead_peers:
            if dead_pid in self.meeting_rooms.get(room_id, {}):
                del self.meeting_rooms[room_id][dead_pid]

    async def send_to_peer(self, room_id: str, target_peer_id: str, message: dict):
        """Used for WebRTC signaling (SDP offer, answer, ICE candidates) direct to peer."""
        if room_id in self.meeting_rooms and target_peer_id in self.meeting_rooms[room_id]:
            try:
                await self.meeting_rooms[room_id][target_peer_id]["ws"].send_json(message)
            except Exception as e:
                logger.warning(f"Failed sending signaling message to {target_peer_id}: {e}")

    def get_meeting_participants(self, room_id: str) -> List[dict]:
        if room_id not in self.meeting_rooms:
            return []
        return [
            {"peer_id": pid, **data["user"]}
            for pid, data in self.meeting_rooms[room_id].items()
        ]

ws_manager = ConnectionManager()
