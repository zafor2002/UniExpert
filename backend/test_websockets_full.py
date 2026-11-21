"""
Automated Test Suite for Real-Time WebSockets:
1. Team Chat WebSocket (Streaming, Persistence, Typing indicators)
2. Live Meeting & Consultation WebSocket (Roster, Media State, Hand Raising, In-Meeting Chat, Collaborative Agenda)
"""
import asyncio
import websockets
import json
import requests
import sys

BASE_HTTP = "http://127.0.0.1:8000/api"
BASE_WS = "ws://127.0.0.1:8000/api"

async def test_full_websockets():
    print("=" * 70)
    print("STARTING FULL WEBSOCKET REAL-TIME TEST: CHAT & MEETING")
    print("=" * 70)

    # 1. REST Health check for Meeting Rooms
    print("\n[STEP 1] Testing Meeting REST Endpoints...")
    resp = requests.get(f"{BASE_HTTP}/meeting/active")
    assert resp.status_code == 200, f"Failed meeting active: {resp.text}"
    rooms = resp.json()
    print(f"[SUCCESS] Active rooms retrieved: {len(rooms)} room(s) listed.")
    assert len(rooms) >= 2, "Expected at least 2 default meeting rooms"

    # 2. Team Chat WebSocket Test
    print("\n[STEP 2] Testing Bidirectional Team Chat WebSocket on /api/chat/ws/ch-general ...")
    chat_url = f"{BASE_WS}/chat/ws/ch-general"

    async with websockets.connect(chat_url) as ws_alice:
        async with websockets.connect(chat_url) as ws_bob:
            # 2a. Typing indicator test
            print(" -> Alice sends typing indicator...")
            await ws_alice.send(json.dumps({
                "type": "typing",
                "sender_id": "stu-1",
                "sender_name": "Abu Zafor",
                "is_typing": True
            }))
            bob_msg = json.loads(await asyncio.wait_for(ws_bob.recv(), timeout=3.0))
            print(" -> Bob received frame:", bob_msg)
            assert bob_msg["type"] == "typing"
            assert bob_msg["sender_name"] == "Abu Zafor"
            print(" [PASS] Real-time typing notification verified!")

            # 2b. Message streaming and SQLite persistence test
            print(" -> Alice sends chat message...")
            unique_text = f"Live verification message #{asyncio.get_event_loop().time()}"
            await ws_alice.send(json.dumps({
                "type": "chat_message",
                "sender_id": "stu-1",
                "sender_name": "Abu Zafor",
                "content": unique_text
            }))

            # Bob receives broadcast
            bob_chat = json.loads(await asyncio.wait_for(ws_bob.recv(), timeout=3.0))
            print(" -> Bob received chat broadcast:", bob_chat["content"])
            assert bob_chat["type"] == "new_message"
            assert bob_chat["content"] == unique_text
            print(" [PASS] Real-time message broadcast verified!")

    # Verify message in SQLite database via REST endpoint
    history_resp = requests.get(f"{BASE_HTTP}/chat/messages/ch-general")
    assert history_resp.status_code == 200
    history = history_resp.json()
    saved = any(m["content"] == unique_text for m in history)
    assert saved, "Message was not persisted in SQLite ChatMessage table!"
    print(f" [PASS] Message persistence verified in SQLite (History has {len(history)} messages)!")

    # 3. Live Meeting & Consultation WebSocket Test
    print("\n[STEP 3] Testing Live Meeting & Video Consultation WebSocket on /api/meeting/ws/room-edgeshield ...")
    room_id = "room-edgeshield"
    ws_student_url = f"{BASE_WS}/meeting/ws/{room_id}?peer_id=peer-az&name=Abu+Zafor&role=Team+Lead"
    ws_faculty_url = f"{BASE_WS}/meeting/ws/{room_id}?peer_id=peer-fr&name=Dr.+Farhana+Rahman&role=Supervisor"

    async with websockets.connect(ws_student_url) as ws_student:
        # Student receives initial room state
        init_state = json.loads(await asyncio.wait_for(ws_student.recv(), timeout=3.0))
        print(" -> Student received room_state. Current participants:", len(init_state["participants"]))
        assert init_state["type"] == "room_state"

        async with websockets.connect(ws_faculty_url) as ws_faculty:
            # Faculty receives initial room state
            faculty_state = json.loads(await asyncio.wait_for(ws_faculty.recv(), timeout=3.0))
            assert faculty_state["type"] == "room_state"

            # Student receives peer_joined for faculty
            joined_frame = json.loads(await asyncio.wait_for(ws_student.recv(), timeout=3.0))
            print(f" -> Student notified of faculty arrival: {joined_frame['user']['name']} ({joined_frame['peer_id']})")
            assert joined_frame["type"] == "peer_joined"
            assert joined_frame["peer_id"] == "peer-fr"

            # 3a. Media State Toggle (Mic Mute / Camera)
            print(" -> Faculty toggles mic mute state...")
            await ws_faculty.send(json.dumps({
                "type": "media_state",
                "audio_muted": True,
                "video_off": False
            }))
            media_frame = json.loads(await asyncio.wait_for(ws_student.recv(), timeout=3.0))
            print(" -> Student received peer_media_updated:", media_frame["media_state"])
            assert media_frame["type"] == "peer_media_updated"
            assert media_frame["media_state"]["audio_muted"] is True
            print(" [PASS] Meeting media state toggle verified!")

            # 3b. Hand Raising
            print(" -> Student raises hand...")
            await ws_student.send(json.dumps({
                "type": "raise_hand",
                "hand_raised": True
            }))
            hand_frame = json.loads(await asyncio.wait_for(ws_faculty.recv(), timeout=3.0))
            print(" -> Faculty received hand_raised alert:", hand_frame["sender_name"])
            assert hand_frame["type"] == "hand_raised"
            assert hand_frame["hand_raised"] is True
            print(" [PASS] Meeting hand-raising notification verified!")

            # 3c. In-Meeting Chat
            print(" -> Faculty sends in-meeting chat message...")
            await ws_faculty.send(json.dumps({
                "type": "meeting_chat",
                "content": "Please share your CMSIS-NN benchmark screen."
            }))
            chat_frame = json.loads(await asyncio.wait_for(ws_student.recv(), timeout=3.0))
            print(f" -> Student received in-meeting chat: '{chat_frame['content']}' from {chat_frame['sender_name']}")
            assert chat_frame["type"] == "meeting_chat_message"
            assert "CMSIS-NN" in chat_frame["content"]
            print(" [PASS] In-meeting chat verified!")

            # 3d. Collaborative Agenda Checkoff
            print(" -> Student checks off agenda item ag-2...")
            await ws_student.send(json.dumps({
                "type": "agenda_item_toggle",
                "item_id": "ag-2",
                "completed": True
            }))
            agenda_frame = json.loads(await asyncio.wait_for(ws_faculty.recv(), timeout=3.0))
            print(" -> Faculty received agenda_item_toggled:", agenda_frame["item_id"], "completed:", agenda_frame["completed"])
            assert agenda_frame["type"] == "agenda_item_toggled"
            assert agenda_frame["item_id"] == "ag-2"
            assert agenda_frame["completed"] is True
            print(" [PASS] Collaborative agenda synchronization verified!")

        # Faculty disconnects, student receives peer_left
        left_frame = json.loads(await asyncio.wait_for(ws_student.recv(), timeout=3.0))
        print(f" -> Student notified of faculty departure: peer {left_frame['peer_id']} left.")
        assert left_frame["type"] == "peer_left"
        assert left_frame["peer_id"] == "peer-fr"
        print(" [PASS] Peer departure notification verified!")

    print("\n" + "=" * 70)
    print("ALL WEBSOCKET CHAT & MEETING TESTS PASSED WITH 100% INTEGRITY!")
    print("=" * 70)

if __name__ == "__main__":
    asyncio.run(test_full_websockets())
