from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
import json

from app.db.session import get_db, SessionLocal
from app.models.models import ChatMessage
from app.schemas.schemas import ChatMessageCreate, ChatMessageResponse
from app.websockets.manager import ws_manager

router = APIRouter(prefix="/chat", tags=["Team Meeting Chat"])

@router.get("/messages/{channel_id}", response_model=List[ChatMessageResponse])
def get_channel_history(channel_id: str, db: Session = Depends(get_db)):
    """Fetches chronological chat history for a given team channel."""
    return db.query(ChatMessage).filter(ChatMessage.channel_id == channel_id).order_by(ChatMessage.timestamp.asc()).all()

@router.post("/messages", response_model=ChatMessageResponse)
async def post_message(
    msg_in: ChatMessageCreate,
    sender_id: str = "stu-1",
    sender_name: str = "Abu Zafor",
    db: Session = Depends(get_db)
):
    """Submits a chat message via REST API and broadcasts to all WebSocket peers."""
    msg = ChatMessage(
        channel_id=msg_in.channel_id,
        sender_id=sender_id,
        sender_name=sender_name,
        content=msg_in.content,
        timestamp=datetime.utcnow()
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)

    # Broadcast via WebSocket
    await ws_manager.broadcast(msg_in.channel_id, {
        "type": "new_message",
        "id": msg.id,
        "channel_id": msg.channel_id,
        "sender_id": msg.sender_id,
        "sender_name": msg.sender_name,
        "content": msg.content,
        "timestamp": msg.timestamp.isoformat(),
        "pinned": msg.pinned
    })

    return msg

@router.websocket("/ws/{channel_id}")
async def chat_websocket_endpoint(websocket: WebSocket, channel_id: str):
    """
    Bidirectional WebSocket connection for live team chat:
    - Real-time message streaming with persistence to SQLite
    - Typing indicators
    - Peer presence notifications
    """
    await ws_manager.connect(channel_id, websocket)
    try:
        while True:
            data = await websocket.receive_json()
            msg_type = data.get("type", "message")

            if msg_type == "typing":
                # Broadcast typing notification to peers in channel
                await ws_manager.broadcast(channel_id, {
                    "type": "typing",
                    "channel_id": channel_id,
                    "sender_id": data.get("sender_id"),
                    "sender_name": data.get("sender_name", "Team Member"),
                    "is_typing": data.get("is_typing", True)
                })

            elif msg_type == "ping":
                await websocket.send_json({"type": "pong", "timestamp": datetime.utcnow().isoformat()})

            elif msg_type in ("message", "chat_message") or "content" in data:
                content = data.get("content", "").strip()
                if not content:
                    continue
                sender_id = data.get("sender_id", "stu-1")
                sender_name = data.get("sender_name", "Abu Zafor")

                # Persist to SQLite
                db: Session = SessionLocal()
                try:
                    msg = ChatMessage(
                        channel_id=channel_id,
                        sender_id=sender_id,
                        sender_name=sender_name,
                        content=content,
                        timestamp=datetime.utcnow()
                    )
                    db.add(msg)
                    db.commit()
                    db.refresh(msg)

                    payload = {
                        "type": "new_message",
                        "id": msg.id,
                        "channel_id": msg.channel_id,
                        "sender_id": msg.sender_id,
                        "sender_name": msg.sender_name,
                        "content": msg.content,
                        "timestamp": msg.timestamp.isoformat(),
                        "pinned": msg.pinned
                    }
                finally:
                    db.close()

                # Broadcast to all connections in the channel
                await ws_manager.broadcast(channel_id, payload)

    except WebSocketDisconnect:
        ws_manager.disconnect(channel_id, websocket)
