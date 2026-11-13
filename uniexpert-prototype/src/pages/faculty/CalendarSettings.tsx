import React, { useState } from 'react';
import { Calendar, Clock, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useApp } from '../../context/AppContext';

interface SlotItem {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
}

export const CalendarSettings: React.FC = () => {
  const { experts } = useApp();
  const faculty = experts[0];

  const [maxDaily, setMaxDaily] = useState(3);
  const [slots, setSlots] = useState<SlotItem[]>([
    { id: 's1', day: 'Tuesday', startTime: '14:00', endTime: '16:00' },
    { id: 's2', day: 'Thursday', startTime: '10:00', endTime: '11:30' },
    { id: 's3', day: 'Sunday', startTime: '15:00', endTime: '16:00' },
  ]);

  const [newDay, setNewDay] = useState('Tuesday');
  const [newStart, setNewStart] = useState('14:00');
  const [newEnd, setNewEnd] = useState('16:00');

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    const item: SlotItem = {
      id: `s-${Date.now()}`,
      day: newDay,
      startTime: newStart,
      endTime: newEnd,
    };
    setSlots([...slots, item]);
    toast.success(`Recurring slot added for ${newDay}.`);
  };

  const handleRemoveSlot = (id: string) => {
    setSlots(slots.filter((s) => s.id !== id));
  };

  const handleSave = () => {
    toast.success('Calendar settings updated successfully.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24">
      <div>
        <h1 className="text-xl font-bold text-[#1E293B] flex items-center gap-2">
          <Calendar className="text-[#334155]" size={22} />
          Advisory Calendar & Office Hours Settings
        </h1>
        <p className="text-xs text-[#64748B] mt-0.5">
          Configure recurring 30-minute student consultation blocks for Fall 2026
        </p>
      </div>

      {/* Max daily consultations limit */}
      <div className="card p-6 md:p-8 space-y-4 bg-white border border-[#E2E8F0] rounded-3xl shadow-sm">
        <h2 className="text-base font-bold text-[#1E293B] flex items-center gap-2">
          <Clock size={18} className="text-[#8AB4F8]" />
          Daily Workload Governor
        </h2>

        <div className="flex items-center gap-4">
          <div>
            <label className="label text-[#334155] font-semibold">Maximum Consultations Per Day</label>
            <input
              type="number"
              min={1}
              max={8}
              value={maxDaily}
              onChange={(e) => setMaxDaily(Number(e.target.value))}
              className="input text-xs w-28 font-mono"
            />
          </div>
          <p className="text-xs text-[#64748B] mt-4">
            System automatically prevents students from booking more than {maxDaily} sessions in a single day
          </p>
        </div>
      </div>

      {/* Weekly recurring office hour blocks */}
      <div className="card p-6 md:p-8 space-y-5 bg-white border border-[#E2E8F0] rounded-3xl shadow-sm">
        <div>
          <h2 className="text-base font-bold text-[#1E293B]">
            Weekly Recurring Consultation Blocks
          </h2>
          <p className="text-xs text-[#64748B]">
            Each block is automatically sliced into 30-minute bookable calendar slots
          </p>
        </div>

        <form onSubmit={handleAddSlot} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label className="label text-[#334155] font-semibold">Day of Week</label>
            <select
              value={newDay}
              onChange={(e) => setNewDay(e.target.value)}
              className="input text-xs"
            >
              <option value="Sunday">Sunday</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
              <option value="Saturday">Saturday</option>
            </select>
          </div>

          <div>
            <label className="label text-[#334155] font-semibold">Start Time</label>
            <input
              type="time"
              value={newStart}
              onChange={(e) => setNewStart(e.target.value)}
              className="input text-xs font-mono"
              required
            />
          </div>

          <div>
            <label className="label text-[#334155] font-semibold">End Time</label>
            <input
              type="time"
              value={newEnd}
              onChange={(e) => setNewEnd(e.target.value)}
              className="input text-xs font-mono"
              required
            />
          </div>

          <div className="flex items-end">
            <button type="submit" className="btn-secondary text-xs w-full justify-center py-2.5 rounded-xl">
              <Plus size={14} /> Add Block
            </button>
          </div>
        </form>

        <div className="space-y-2 pt-2">
          {slots.map((s) => (
            <div
              key={s.id}
              className="p-4 rounded-2xl border border-[#E2E8F0] bg-[#F4F8FF] flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-4">
                <span className="font-bold text-[#1E293B] w-24">
                  {s.day}
                </span>
                <span className="font-mono text-[#334155] font-semibold">
                  {s.startTime} - {s.endTime}
                </span>
                <span className="text-[#64748B]">
                  (4 atomic 30-min slots generated)
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveSlot(s.id)}
                className="text-[#64748B] hover:text-red-600 p-1 rounded-lg hover:bg-white"
                title="Remove slot"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button onClick={handleSave} className="btn-primary text-xs px-6 py-3 font-bold rounded-xl shadow-sm">
          <CheckCircle2 size={14} /> Update Consultation Calendar
        </button>
      </div>
    </div>
  );
};

export default CalendarSettings;
