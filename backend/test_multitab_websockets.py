import asyncio
import websockets
import json

async def test_tabs_via_vite_proxy():
    print("Testing Team Chat WebSocket via Vite proxy ws://localhost:5173/api/chat/ws/ch-general...")
    
    # Connect Tab 1 and Tab 2
    async with websockets.connect("ws://localhost:5173/api/chat/ws/ch-general") as tab1, \
               websockets.connect("ws://localhost:5173/api/chat/ws/ch-general") as tab2:
        
        # Test 1: Tab 1 types
        await tab1.send(json.dumps({
            "type": "typing",
            "sender_id": "stu-1",
            "sender_name": "Abu Zafor",
            "client_id": "client-tab1",
            "is_typing": True
        }))
        
        # Tab 2 receives typing
        frame = json.loads(await asyncio.wait_for(tab2.recv(), timeout=2.0))
        assert frame["type"] == "typing"
        assert frame["client_id"] == "client-tab1"
        assert frame["sender_name"] == "Abu Zafor"
        print("  [PASS] Tab 2 received typing from Tab 1!")
        
        # Test 2: Tab 2 sends message as Dr. Farhana Rahman
        await tab2.send(json.dumps({
            "type": "chat_message",
            "content": "Hello Abu Zafor! Live consultation is ready.",
            "sender_id": "exp-1",
            "sender_name": "Dr. Farhana Rahman",
            "client_id": "client-tab2",
            "client_msg_id": "msg-tab2-001"
        }))
        
        # Tab 1 receives Dr. Rahman's message
        found = False
        for _ in range(3):
            msg = json.loads(await asyncio.wait_for(tab1.recv(), timeout=2.0))
            if msg.get("type") == "new_message":
                assert msg["sender_name"] == "Dr. Farhana Rahman"
                assert msg["client_id"] == "client-tab2"
                print("  [PASS] Tab 1 received message from Tab 2:", msg["content"])
                found = True
                break
        assert found, "Tab 1 did not receive new_message"

    print("Testing Meeting Room WebSocket via Vite proxy ws://localhost:5173/api/meeting/ws/room-test...")
    # Connect Tab 1 and Tab 2 with session peer IDs
    async with websockets.connect("ws://localhost:5173/api/meeting/ws/room-test?peer_id=stu-1-tab1&name=Abu%20Zafor&role=Student") as m1:
        s1 = json.loads(await asyncio.wait_for(m1.recv(), timeout=2.0))
        assert s1["type"] == "room_state"
        
        async with websockets.connect("ws://localhost:5173/api/meeting/ws/room-test?peer_id=exp-1-tab2&name=Dr.%20Farhana%20Rahman&role=Faculty") as m2:
            s2 = json.loads(await asyncio.wait_for(m2.recv(), timeout=2.0))
            assert s2["type"] == "room_state"
            
            # m1 receives peer_joined for m2
            join_frame = json.loads(await asyncio.wait_for(m1.recv(), timeout=2.0))
            assert join_frame["type"] == "peer_joined"
            assert join_frame["peer_id"] == "exp-1-tab2"
            print("  [PASS] Tab 1 detected Tab 2 joined the meeting!")
            
            # m2 toggles mute
            await m2.send(json.dumps({"type": "media_state", "audio_muted": True}))
            media_frame = json.loads(await asyncio.wait_for(m1.recv(), timeout=2.0))
            assert media_frame["type"] == "peer_media_updated"
            assert media_frame["media_state"]["audio_muted"] is True
            print("  [PASS] Tab 1 received Tab 2 mute toggle!")
            
            # m1 raises hand
            await m1.send(json.dumps({"type": "raise_hand", "hand_raised": True}))
            hand_frame = json.loads(await asyncio.wait_for(m2.recv(), timeout=2.0))
            assert hand_frame["type"] == "hand_raised"
            assert hand_frame["hand_raised"] is True
            print("  [PASS] Tab 2 received Tab 1 hand-raise alert!")

    print("\n======================================================================")
    print("ALL BROWSER PROXY MULTI-TAB WEBSOCKET TESTS PASSED!")
    print("======================================================================")

if __name__ == "__main__":
    asyncio.run(test_tabs_via_vite_proxy())
