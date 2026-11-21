import asyncio
import websockets
import json

async def test_full_meeting_flow():
    print("Testing Comprehensive Multi-Tab Meeting Room on ws://localhost:5173/api/meeting/ws/room-edgeshield ...")
    
    # Connect Tab 1 (Abu Zafor)
    async with websockets.connect(
        "ws://localhost:5173/api/meeting/ws/room-edgeshield?peer_id=stu-1-tab1&name=Abu%20Zafor&role=Team%20Lead"
    ) as m1:
        # Tab 1 initial room state
        s1 = json.loads(await asyncio.wait_for(m1.recv(), timeout=2.0))
        assert s1["type"] == "room_state"
        assert len(s1.get("agenda", [])) >= 1, "Agenda items should be present"
        print("  [PASS] Tab 1 joined room-edgeshield and received initial room_state & agenda!")

        # Connect Tab 2 (Dr. Farhana Rahman)
        async with websockets.connect(
            "ws://localhost:5173/api/meeting/ws/room-edgeshield?peer_id=exp-1-tab2&name=Dr.%20Farhana%20Rahman&role=Supervisor"
        ) as m2:
            s2 = json.loads(await asyncio.wait_for(m2.recv(), timeout=2.0))
            assert s2["type"] == "room_state"
            print("  [PASS] Tab 2 joined room-edgeshield!")

            # Tab 1 receives peer_joined frame for Tab 2
            join_frame = json.loads(await asyncio.wait_for(m1.recv(), timeout=2.0))
            assert join_frame["type"] == "peer_joined"
            assert join_frame["peer_id"] == "exp-1-tab2"
            assert join_frame["user"]["name"] == "Dr. Farhana Rahman"
            print("  [PASS] Tab 1 notified: Dr. Farhana Rahman joined the meeting!")

            # 1. Media State Toggle: Tab 2 mutes mic
            await m2.send(json.dumps({"type": "media_state", "audio_muted": True, "video_off": False}))
            media_frame = json.loads(await asyncio.wait_for(m1.recv(), timeout=2.0))
            assert media_frame["type"] == "peer_media_updated"
            assert media_frame["peer_id"] == "exp-1-tab2"
            assert media_frame["media_state"]["audio_muted"] is True
            print("  [PASS] Tab 1 received Tab 2 mic mute toggle in real time!")

            # 2. Hand-Raise Alert: Tab 1 raises hand
            await m1.send(json.dumps({"type": "raise_hand", "hand_raised": True}))
            hand_frame = json.loads(await asyncio.wait_for(m2.recv(), timeout=2.0))
            assert hand_frame["type"] == "hand_raised"
            assert hand_frame["peer_id"] == "stu-1-tab1"
            assert hand_frame["hand_raised"] is True
            print("  [PASS] Tab 2 received Tab 1 hand-raise alert (✋) in real time!")

            # 3. In-Meeting Live Chat: Tab 2 sends message
            await m2.send(json.dumps({
                "type": "meeting_chat",
                "content": "Please review the CMSIS-NN benchmark table."
            }))
            chat_frame = json.loads(await asyncio.wait_for(m1.recv(), timeout=2.0))
            assert chat_frame["type"] == "meeting_chat_message"
            assert chat_frame["sender_name"] == "Dr. Farhana Rahman"
            assert "CMSIS-NN" in chat_frame["content"]
            print("  [PASS] Tab 1 received in-meeting chat message:", chat_frame["content"])

            # 4. Collaborative Agenda Checkoff: Tab 1 checks off ag-2
            await m1.send(json.dumps({
                "type": "agenda_item_toggle",
                "item_id": "ag-2",
                "completed": True
            }))
            agenda_frame = json.loads(await asyncio.wait_for(m2.recv(), timeout=2.0))
            assert agenda_frame["type"] == "agenda_item_toggled"
            assert agenda_frame["item_id"] == "ag-2"
            assert agenda_frame["completed"] is True
            print("  [PASS] Tab 2 received live collaborative agenda checkoff (ag-2 completed: True)!")

        # 5. Peer Departure: Tab 2 disconnects -> Tab 1 notified
        leave_frame = json.loads(await asyncio.wait_for(m1.recv(), timeout=2.0))
        assert leave_frame["type"] == "peer_left"
        assert leave_frame["peer_id"] == "exp-1-tab2"
        print("  [PASS] Tab 1 notified: Dr. Farhana Rahman left the room!")

    print("\n======================================================================")
    print("ALL LIVE MEETING WEBSOCKET CAPABILITIES VERIFIED 100% OPERATIONAL!")
    print("======================================================================")

if __name__ == "__main__":
    asyncio.run(test_full_meeting_flow())
