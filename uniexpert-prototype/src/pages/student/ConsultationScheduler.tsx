import React, { useState } from 'react';
import { Calendar, Clock, Download, Video, CheckCircle2, AlertTriangle, FileText, Upload, UserCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useApp } from '../../context/AppContext';
import type { OfficeHourSlot } from '../../types';

export const ConsultationScheduler: React.FC = () => {
  const { experts } = useApp();
  const advisor = experts[0]; // Dr. Farhana Rahman

  const [selectedSlot, setSelectedSlot] = useState<OfficeHourSlot | null>(null);
  const [agenda, setAgenda] = useState('Review TinyML CMSIS-NN quantization benchmark and finalize BLE advertising packet structure.');
  const [attachedDoc, setAttachedDoc] = useState<string | null>(null);
  const [isBookedSuccess, setIsBookedSuccess] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  const slots = advisor.officeHours;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 25 MB max
    if (file.size > 25 * 1024 * 1024) {
      toast.error('Attachment exceeds 25 MB limit. Please use GitHub or Google Drive and paste the link.');
      return;
    }

    setAttachedDoc(file.name);
    toast.success(`Attached "${file.name}" for advisor review.`);
  };

  const handleBookConsultation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) {
      toast.error('Please choose an available 30-minute consultation slot.');
      return;
    }

    if (!agenda.trim()) {
      toast.error('A mandatory agenda is required for faculty consultation.');
      return;
    }

    // Check if slot was booked
    if (selectedSlot.isBooked) {
      toast.error('Slot was just booked by another team. Please select a different time.');
      return;
    }

    setIsBooking(true);
    setTimeout(() => {
      setIsBooking(false);
      setIsBookedSuccess(true);
      toast.success('Consultation booked successfully. Calendar invitation generated.');
    }, 1200);
  };

  const triggerSlotConflictError = () => {
    toast.error('Slot was just booked by another team. Please select a different time.');
  };

  const downloadICS = () => {
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Daffodil International University//UniExpert//EN
BEGIN:VEVENT
SUMMARY:UniExpert Consultation: Dr. Farhana Rahman
DESCRIPTION:${agenda}
LOCATION:Zoom Conference Link (DIU Virtual Classroom)
DTSTART:20261117T140000Z
DTEND:20261117T143000Z
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'uniexpert_consultation.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Downloaded uniexpert_consultation.ics');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Calendar className="text-primary-600" size={22} />
          Faculty Office Hours & Consultation Scheduler
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Atomic 30-minute calendar reservation directly synchronized with academic availability
        </p>
      </div>

      {/* Target Advisor Card */}
      <div className="card p-6 bg-white border border-[#E2E8F0] shadow-sm rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#EAF2FF] border border-[#8AB4F8]/50 flex items-center justify-center font-bold text-lg text-[#1E293B]">
            FR
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#1E293B]">{advisor.name}</h2>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full font-semibold bg-[#EAF2FF] text-[#1E293B] border border-[#8AB4F8]/40">
                Tier {advisor.tier} Verified
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">{advisor.title} · {advisor.department}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-[#334155] bg-[#F4F8FF] px-3.5 py-2 rounded-2xl border border-[#E2E8F0]">
          <Clock size={16} className="text-[#8AB4F8]" />
          <span>Max 3 Daily Consultations · 30-min Atomic Slot</span>
        </div>
      </div>

      {isBookedSuccess ? (
        <div className="card p-8 text-center space-y-5 border border-[#A7E8D0] bg-[#A7E8D0]/15 rounded-3xl animate-in fade-in">
          <div className="w-16 h-16 rounded-full bg-[#A7E8D0] text-[#1E293B] flex items-center justify-center mx-auto">
            <CheckCircle2 size={36} />
          </div>
          <h2 className="text-xl font-bold text-[#1E293B]">Office Hour Booking Confirmed!</h2>
          <p className="text-sm text-[#334155] max-w-md mx-auto">
            Your appointment with <strong>Dr. Farhana Rahman</strong> has been confirmed for <strong>{selectedSlot?.day} at {selectedSlot?.startTime} - {selectedSlot?.endTime}</strong>.
          </p>

          <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] max-w-md mx-auto text-left space-y-3 shadow-2xs">
            <div className="flex items-center justify-between text-xs pb-2 border-b border-[#E2E8F0]">
              <span className="text-[#64748B]">Virtual Room:</span>
              <span className="font-mono font-semibold text-[#1E293B] flex items-center gap-1">
                <Video size={13} className="text-[#8AB4F8]" /> https://diu.zoom.us/j/9402135331
              </span>
            </div>
            <div className="text-xs">
              <span className="text-[#64748B] block mb-0.5">Submitted Agenda:</span>
              <p className="text-[#1E293B] font-medium">{agenda}</p>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <button
              onClick={downloadICS}
              className="btn-primary text-xs px-5 py-2.5 rounded-xl shadow-sm"
            >
              <Download size={14} /> Download .ics Calendar File
            </button>
            <button
              onClick={() => setIsBookedSuccess(false)}
              className="btn-secondary text-xs px-5 py-2.5 rounded-xl"
            >
              Book Another Slot
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleBookConsultation} className="space-y-6">
          {/* Weekly Available Slots Grid */}
          <div className="card p-6 md:p-8 space-y-5 bg-white border border-[#E2E8F0] rounded-3xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#1E293B]">
                  1. Select a 30-Minute Office Hour Window
                </h3>
                <p className="text-xs text-[#64748B]">
                  Recurring Fall 2026 availability authorized by department coordinator
                </p>
              </div>
              <button
                type="button"
                onClick={triggerSlotConflictError}
                className="text-xs text-amber-800 border border-amber-200 bg-amber-50 px-3 py-1.5 rounded-xl flex items-center gap-1.5 font-medium hover:bg-amber-100 transition-colors"
              >
                <AlertTriangle size={12} className="text-amber-600" /> Test Slot Conflict Error
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {slots.map((slot) => {
                const isSelected = selectedSlot?.id === slot.id;
                return (
                  <button
                    key={slot.id}
                    type="button"
                    disabled={slot.isBooked}
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-4 rounded-2xl border text-left transition-all relative ${
                      slot.isBooked
                        ? 'bg-slate-50 border-[#E2E8F0] text-slate-400 cursor-not-allowed'
                        : isSelected
                        ? 'bg-[#EAF2FF] border-2 border-[#8AB4F8] text-[#1E293B] ring-2 ring-[#8AB4F8]/20'
                        : 'bg-white border-[#E2E8F0] hover:bg-[#F4F8FF] text-[#334155]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-[#1E293B]">{slot.day}</span>
                      {slot.isBooked ? (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-[#E2E8F0]">
                          Booked
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#A7E8D0]/30 text-[#1E293B] border border-[#A7E8D0]">
                          Open
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-mono font-medium text-[#64748B]">
                      {slot.startTime} - {slot.endTime}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Agenda Field */}
          <div className="card p-6 md:p-8 space-y-5 bg-white border border-[#E2E8F0] rounded-3xl shadow-sm">
            <h3 className="text-base font-bold text-[#1E293B]">
              2. Mandatory Consultation Agenda
            </h3>
            <p className="text-xs text-[#64748B]">
              Department policy requires pre-formulated discussion topics for time-efficient advising
            </p>
            <textarea
              rows={3}
              value={agenda}
              onChange={(e) => setAgenda(e.target.value)}
              placeholder="e.g. Discuss hardware pinout, review baseline INT8 quantization loss..."
              className="input text-xs leading-relaxed"
              required
            />

            {/* Document Attach (25MB validation) */}
            <div className="pt-2">
              <label className="label text-[#334155] font-semibold">Attach Draft Documents / Slides (Optional, max 25 MB)</label>
              {attachedDoc ? (
                <div className="p-3.5 rounded-2xl bg-[#F4F8FF] border border-[#E2E8F0] flex items-center justify-between">
                  <span className="text-xs font-medium text-[#1E293B] flex items-center gap-2">
                    <FileText size={14} className="text-[#8AB4F8]" />
                    {attachedDoc}
                  </span>
                  <button
                    type="button"
                    onClick={() => setAttachedDoc(null)}
                    className="text-xs text-red-600 font-semibold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-[#E2E8F0] rounded-2xl p-5 text-center hover:bg-[#F4F8FF] transition-colors relative cursor-pointer">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="flex items-center justify-center gap-2 text-xs text-[#64748B]">
                    <Upload size={14} className="text-[#8AB4F8]" /> Click to browse PDF, DOCX, ZIP (Max 25 MB)
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isBooking}
              className="btn-primary text-xs px-6 py-3 font-bold rounded-xl shadow-sm"
            >
              <UserCheck size={14} />
              {isBooking ? 'Verifying Availability...' : 'Confirm Atomic Office Hour Slot'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ConsultationScheduler;

