from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.db.session import get_db
from app.models.models import ChatMessage
from app.schemas.schemas import ChatMessageCreate, ChatMessageResponse
from app.websockets.manager import ws_manager

router = APIRouter(prefix="/chat", tags=["Team Meeting Chat"])

@router.get("/messages/{channel_id}", response_model=List[ChatMessageResponse])
def get_channel_history(channel_id: str, db: Session = Depends(get_db)):
    return db.query(ChatMessage).filter(ChatMessage.channel_id == channel_id).order_by(ChatMessage.timestamp.asc()).all()

@router.post("/messages", response_model=ChatMessageResponse)
async def post_message(msg_in: ChatMessageCreate, sender_id: str = "stu-1", sender_name: str = "Abu Zafor", db: Session = Depends(get_db)):
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
    await ws_manager.connect(channel_id, websocket)
    try:
        while True:
            data = await websocket.receive_json()
            # Broadcast received frame to all connections in the channel
            await ws_manager.broadcast(channel_id, data)
    except WebSocketDisconnect:
        ws_manager.disconnect(channel_id, websocket)
