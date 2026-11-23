from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException, Query
from typing import List, Dict, Any, Optional
from datetime import datetime
import json
import uuid

from app.websockets.manager import ws_manager

router = APIRouter(prefix="/meeting", tags=["Real-Time Video & Meeting Rooms"])

# In-memory registry of active meeting rooms
MEETING_ROOMS: Dict[str, Dict[str, Any]] = {
    "room-edgeshield": {
        "room_id": "room-edgeshield",
        "title": "EdgeShield Capstone Weekly Advisory Sync",
        "topic": "TinyML CMSIS-NN Optimization & BLE 5.0 Packet Structure",
        "advisor_name": "Md. Shohel Arman",
        "advisor_id": "exp-1",
        "created_at": datetime.utcnow().isoformat(),
        "is_active": True,
        "agenda": [
            {"id": "ag-1", "text": "Review TinyML CMSIS-NN 8-bit quantization benchmark", "completed": True},
            {"id": "ag-2", "text": "Verify BLE 5.0 AES-GCM transport payload format", "completed": False},
            {"id": "ag-3", "text": "Lock Milestone 2 deliverable submission date", "completed": False}
        ],
        "chat_messages": [
            {
                "id": "mc-init-1",
                "sender_id": "exp-1",
                "sender_name": "Md. Shohel Arman",
                "sender_role": "Supervisor",
                "content": "Welcome to the consultation! Please verify your latest TinyML quantization benchmarks before we begin.",
                "timestamp": "2026-11-23T14:30:00Z"
            },
            {
                "id": "mc-init-2",
                "sender_id": "stu-1",
                "sender_name": "Abu Zafor",
                "sender_role": "Team Lead",
                "content": "All benchmarks and BLE GATT packet profiles are ready for review.",
                "timestamp": "2026-11-23T14:35:00Z"
            }
        ]
    },
    "room-consultation-fr": {
        "room_id": "room-consultation-fr",
        "title": "Md. Shohel Arman Office Hour Consultation",
        "topic": "Biomedical Sensor Interfacing & Thesis Review",
        "advisor_name": "Md. Shohel Arman",
        "advisor_id": "exp-1",
        "created_at": datetime.utcnow().isoformat(),
        "is_active": True,
        "agenda": [
            {"id": "ag-1", "text": "Hardware prototype validation & power budget check", "completed": False}
        ],
        "chat_messages": [
            {
                "id": "mc-init-3",
                "sender_id": "exp-1",
                "sender_name": "Md. Shohel Arman",
                "sender_role": "Supervisor",
                "content": "Office hour session is open. Please raise your hand if you have specific architectural questions.",
                "timestamp": "2026-11-23T14:00:00Z"
            }
        ]
    }
}

@router.get("/rooms/{room_id}")
def get_room_details(room_id: str):
    """Retrieves metadata and live participants for a given meeting room."""
    room = MEETING_ROOMS.get(room_id)
    if not room:
        # Create an ad-hoc room if it does not exist
        room = {
            "room_id": room_id,
            "title": f"Meeting Room: {room_id.replace('-', ' ').title()}",
            "topic": "Live Capstone Project Consultation",
            "advisor_name": "Md. Shohel Arman",
            "advisor_id": "exp-1",
            "created_at": datetime.utcnow().isoformat(),
            "is_active": True,
            "agenda": [
                {"id": "ag-1", "text": "Review project progress and deliverables", "completed": False}
            ]
        }
        MEETING_ROOMS[room_id] = room

    participants = ws_manager.get_meeting_participants(room_id)
    return {
        **room,
        "participants": participants,
        "participant_count": len(participants)
    }

@router.get("/rooms/{room_id}/messages", response_model=List[Dict[str, Any]])
def get_meeting_messages(room_id: str):
    """Retrieves chronological in-meeting text chat history for a session."""
    room = MEETING_ROOMS.get(room_id)
    if not room:
        return []
    return room.get("chat_messages", [])

@router.get("/active", response_model=List[Dict[str, Any]])
def list_active_rooms():
    """Returns all available meeting rooms with live participant counts."""
    res = []
    for room_id, data in MEETING_ROOMS.items():
        participants = ws_manager.get_meeting_participants(room_id)
        res.append({
            **data,
            "participant_count": len(participants),
            "participants": participants
        })
    return res

@router.post("/rooms/{room_id}/agenda")
async def update_room_agenda(room_id: str, agenda_items: List[Dict[str, Any]]):
    """Updates the collaborative live meeting agenda and broadcasts to attendees."""
    if room_id in MEETING_ROOMS:
        MEETING_ROOMS[room_id]["agenda"] = agenda_items
    
    await ws_manager.broadcast_to_meeting(room_id, {
        "type": "agenda_updated",
        "agenda": agenda_items
    })
    return {"status": "success", "agenda": agenda_items}

@router.websocket("/ws/{room_id}")
async def meeting_websocket_endpoint(
    websocket: WebSocket,
    room_id: str,
    peer_id: Optional[str] = Query(None),
    name: Optional[str] = Query(None),
    role: Optional[str] = Query(None)
):
    """
    Real-Time WebSocket signaling & presence endpoint for Video Consultation & Meeting:
    - WebRTC SDP offer/answer and ICE candidate routing
    - Live audio mute, camera state, screen sharing sync
    - In-meeting messaging and hand raising
    - Collaborative agenda checkoffs
    """
    assigned_peer_id = peer_id or f"peer-{uuid.uuid4().hex[:8]}"
    user_info = {
        "name": name or "Participant",
        "role": role or "Student",
        "audio_muted": False,
        "video_off": False,
        "screen_sharing": False,
        "hand_raised": False,
        "joined_at": datetime.utcnow().isoformat()
    }

    # Look up or create room
    if room_id not in MEETING_ROOMS:
        MEETING_ROOMS[room_id] = {
            "room_id": room_id,
            "title": f"Meeting Room: {room_id.replace('-', ' ').title()}",
            "topic": "Live Capstone Project Consultation",
            "advisor_name": "Md. Shohel Arman",
            "advisor_id": "exp-1",
            "created_at": datetime.utcnow().isoformat(),
            "is_active": True,
            "agenda": [
                {"id": "ag-1", "text": "Review project progress and deliverables", "completed": False},
                {"id": "ag-2", "text": "Verify BLE 5.0 AES-GCM transport payload format", "completed": False},
                {"id": "ag-3", "text": "Lock Milestone 2 deliverable submission date", "completed": False}
            ]
        }

    agenda_items = MEETING_ROOMS[room_id].get("agenda", [])
    chat_history = MEETING_ROOMS[room_id].get("chat_messages", [])

    # Register in meeting manager and announce arrival with current roster & chat history
    await ws_manager.join_meeting(
        room_id,
        assigned_peer_id,
        user_info,
        websocket,
        agenda=agenda_items,
        chat_messages=chat_history
    )

    try:
        while True:
            data = await websocket.receive_json()
            event_type = data.get("type")

            # 1. WebRTC Signaling (Direct Peer-to-Peer Relay)
            if event_type in ("webrtc_offer", "webrtc_answer", "ice_candidate"):
                target_peer = data.get("target_peer_id")
                if target_peer:
                    data["from_peer_id"] = assigned_peer_id
                    await ws_manager.send_to_peer(room_id, target_peer, data)

            # 2. Media State Toggle (Mute / Camera / Screen Share)
            elif event_type == "media_state":
                if room_id in ws_manager.meeting_rooms and assigned_peer_id in ws_manager.meeting_rooms[room_id]:
                    peer_entry = ws_manager.meeting_rooms[room_id][assigned_peer_id]
                    if "audio_muted" in data:
                        peer_entry["user"]["audio_muted"] = data["audio_muted"]
                    if "video_off" in data:
                        peer_entry["user"]["video_off"] = data["video_off"]
                    if "screen_sharing" in data:
                        peer_entry["user"]["screen_sharing"] = data["screen_sharing"]

                await ws_manager.broadcast_to_meeting(
                    room_id,
                    {
                        "type": "peer_media_updated",
                        "peer_id": assigned_peer_id,
                        "media_state": {
                            "audio_muted": data.get("audio_muted"),
                            "video_off": data.get("video_off"),
                            "screen_sharing": data.get("screen_sharing")
                        }
                    },
                    exclude_peer=assigned_peer_id
                )

            # 3. Hand Raising
            elif event_type == "raise_hand":
                raised = data.get("hand_raised", True)
                if room_id in ws_manager.meeting_rooms and assigned_peer_id in ws_manager.meeting_rooms[room_id]:
                    ws_manager.meeting_rooms[room_id][assigned_peer_id]["user"]["hand_raised"] = raised

                await ws_manager.broadcast_to_meeting(
                    room_id,
                    {
                        "type": "hand_raised",
                        "peer_id": assigned_peer_id,
                        "sender_name": user_info["name"],
                        "hand_raised": raised
                    },
                    exclude_peer=assigned_peer_id
                )

            # 4. In-Meeting Live Chat Message
            elif event_type == "meeting_chat":
                msg_content = data.get("content", "").strip()
                if not msg_content:
                    continue
                new_chat_msg = {
                    "type": "meeting_chat_message",
                    "id": data.get("client_msg_id") or f"mc-{uuid.uuid4().hex[:6]}",
                    "sender_id": assigned_peer_id,
                    "sender_name": user_info["name"],
                    "sender_role": user_info["role"],
                    "content": msg_content,
                    "timestamp": datetime.utcnow().isoformat() + "Z"
                }

                if room_id in MEETING_ROOMS:
                    if "chat_messages" not in MEETING_ROOMS[room_id]:
                        MEETING_ROOMS[room_id]["chat_messages"] = []
                    MEETING_ROOMS[room_id]["chat_messages"].append(new_chat_msg)
                    if len(MEETING_ROOMS[room_id]["chat_messages"]) > 100:
                        MEETING_ROOMS[room_id]["chat_messages"] = MEETING_ROOMS[room_id]["chat_messages"][-100:]

                await ws_manager.broadcast_to_meeting(
                    room_id,
                    new_chat_msg,
                    exclude_peer=assigned_peer_id
                )

            # 5. Live Agenda Checkoff
            elif event_type == "agenda_item_toggle":
                item_id = data.get("item_id")
                completed = data.get("completed", False)
                if room_id in MEETING_ROOMS:
                    for item in MEETING_ROOMS[room_id].get("agenda", []):
                        if item.get("id") == item_id:
                            item["completed"] = completed

                await ws_manager.broadcast_to_meeting(
                    room_id,
                    {
                        "type": "agenda_item_toggled",
                        "item_id": item_id,
                        "completed": completed,
                        "actor_name": user_info["name"]
                    },
                    exclude_peer=assigned_peer_id
                )

            # 6. Ping / Keepalive
            elif event_type == "ping":
                await websocket.send_json({"type": "pong", "timestamp": datetime.utcnow().isoformat()})

    except WebSocketDisconnect:
        await ws_manager.leave_meeting(room_id, assigned_peer_id)
