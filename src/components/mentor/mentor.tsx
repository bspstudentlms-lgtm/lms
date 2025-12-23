"use client";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";



import FullCalendar from "@fullcalendar/react";
import {
  EventInput,
  DateSelectArg,
  EventClickArg,
  EventContentArg,
} from "@fullcalendar/core";
import { useModal } from "@/hooks/useModal";
import { Modal } from "@/components/ui/modal";

interface CalendarEvent extends EventInput {
  extendedProps: {
    calendar: string;
  };
}
interface CalendarProps {
  id: string;
}

interface DateEntry {
  key: string;
  label: string;
  value: string;
}

type TimeSlotsMap = Record<string, string[]>;

let dates: DateEntry[] = [];
let timeSlotsMap: TimeSlotsMap = {};
let zoomLink: string = "";

// async function loadDateData() {
//   try {
//     const response = await fetch(`https://backstagepass.co.in/reactapi/get-available-dates.php?id=${id}`);
//     const data = await response.json();

//     dates = data.dates;
//     timeSlotsMap = data.timeSlotsMap;
//     zoomLink = data.zoomLink;

//     renderDates(dates);
//   } catch (error) {
//     console.error("Error loading date data:", error);
//   }
// }

function renderDates(dates: DateEntry[]) {
  dates.forEach(({ key, label, value }) => {
    const slots = timeSlotsMap[key]; // Now valid
    console.log(`${label} (${value}) has slots:`, slots);
  });
}

//loadDateData();

const getFormattedDate = (offset = 0) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    weekday: "short",
  });
};

//const Calendar: React.FC = () => {
const Calendar: React.FC<CalendarProps> = ({ id }) => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    // This runs only on client side after first render
    const storedUserId  = localStorage.getItem('userId');
    setUserId(storedUserId);
  }, []);
  const router = useRouter();

  const [eventTitle, setEventTitle] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [eventLevel, setEventLevel] = useState("");
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const calendarRef = useRef<FullCalendar>(null);
  const { isOpen, openModal, closeModal } = useModal();
  const [dates, setDates] = useState<any[]>([]);
const [timeSlotsMap, setTimeSlotsMap] = useState<Record<string, string[]>>({});
const [zoomLink, setZoomLink] = useState<string>('');
const [mentorid, setMentorid] = useState<string>('');
const [mentorname, setMentorname] = useState<string>('');
const [noDataMessage, setNoDataMessage] = useState<string | null>(null);

  useEffect(() => {
  async function loadDateData() {
    try {
      const response = await fetch(`https://backstagepass.co.in/reactapi/get-available-dates.php?courseid=${id}`);
      const data = await response.json();

      if (!data.dates || data.dates.length === 0) {
        setNoDataMessage("No availability found");
        // Optionally clear old data
        setDates([]);
        setTimeSlotsMap({});
        setZoomLink(null);
        setMentorid(null);
        setMentorname(null);
      } else {
        setDates(data.dates);
        setTimeSlotsMap(data.timeSlotsMap);
        setZoomLink(data.zoomLink);
        setMentorid(data.mentorid);
        setMentorname(data.mentorname);
        setNoDataMessage(null); // clear the message
      }
    } catch (error) {
      console.error("Error loading date data:", error);
      setNoDataMessage("Failed to load availability");
    }
  }

  loadDateData();
}, [id]);

  const calendarsEvents = {
    slot1: "10:00 AM – 11:00 AM",
    slot2: "12:00 AM – 01:00 PM",
    slot3: "03:00 PM – 04:00 PM",
    slot4: "05:00 PM – 06:00 PM",
  };

  useEffect(() => {
    // Initialize with some events
    setEvents([
      {
        id: "1",
        title: "Available",
        start: new Date().toISOString().split("T")[0],
        extendedProps: { calendar: "Success" },
      },
      {
        id: "2",
        title: "Available",
        start: new Date(Date.now() + 86400000).toISOString().split("T")[0],
        extendedProps: { calendar: "Success" },
      },
      {
        id: "3",
        title: "Available",
        start: new Date(Date.now() + 172800000).toISOString().split("T")[0],
        end: new Date(Date.now() + 259200000).toISOString().split("T")[0],
        extendedProps: { calendar: "Success" },
      },
    ]);
  }, []);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    resetModalFields();
    setEventStartDate(selectInfo.startStr);
    setEventEndDate(selectInfo.endStr || selectInfo.startStr);
    openModal();
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    const event = clickInfo.event;
    setSelectedEvent(event as unknown as CalendarEvent);
    setEventTitle(event.title);
    setEventStartDate(event.start?.toISOString().split("T")[0] || "");
    setEventEndDate(event.end?.toISOString().split("T")[0] || "");
    setEventLevel(event.extendedProps.calendar);
    openModal();
  };

  const handleAddOrUpdateEvent = () => {
    if (selectedEvent) {
      // Update existing event
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === selectedEvent.id
            ? {
                ...event,
                title: eventTitle,
                start: eventStartDate,
                end: eventEndDate,
                extendedProps: { calendar: eventLevel },
              }
            : event
        )
      );
    } else {
      // Add new event
      const newEvent: CalendarEvent = {
        id: Date.now().toString(),
        title: eventTitle,
        start: eventStartDate,
        end: eventEndDate,
        allDay: true,
        extendedProps: { calendar: eventLevel },
      };
      setEvents((prevEvents) => [...prevEvents, newEvent]);
    }
    closeModal();
    resetModalFields();
  };

  const handleBooking = async () => {
    
  try {
    const response = await fetch(`https://backstagepass.co.in/reactapi/insert_mentorbook.php?id=${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        mentorid,
        slot: selectedSlot,
        date: selectedDateKey, // optionally include date
      }),
    });

    if (!response.ok) {
      throw new Error('Booking failed');
    }

    const result = await response.json();
    console.log('Booking successful:', result);
    setIsBooked(true); // You already have this
  } catch (error) {
    console.error('Error booking slot:', error);
    alert('Booking failed. Please try again.');
  }
};

  const resetModalFields = () => {
    setEventTitle("");
    setEventStartDate("");
    setEventEndDate("");
    setEventLevel("");
    setSelectedEvent(null);
  };



const [selectedDateKey, setSelectedDateKey] = useState("today");
  const [selectedSlot, setSelectedSlot] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -150, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 150, behavior: "smooth" });
  };

  const [isBooked, setIsBooked] = useState(false);
  //const zoomLink = "https://zoom.us/j/1234567890?pwd=dummyzoomlink";

  return (
    <div className="rounded-2xl border calendarWidth border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="custom-calendar">



      









  <div className="mx-auto p-6 bg-white shadow rounded-lg">
      {/* Scrollable Date Tabs */}
      <div className="relative mb-6">
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow px-2 py-1 rounded-full"
        >
          ◀
        </button>

        <div
          ref={scrollRef}
          className="flex overflow-x-auto no-scrollbar space-x-3 px-8"
        >
          {dates.map((date) => (
            <button
              key={date.key}
              onClick={() => {
                setSelectedDateKey(date.key);
                setSelectedSlot("");
              }}
              className={`whitespace-nowrap px-4 py-2 rounded-lg font-medium ${
                selectedDateKey === date.key
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {date.label}
            </button>
          ))}
        </div>

        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow px-2 py-1 rounded-full"
        >
          ▶
        </button>
      </div>

      {/* Time Slots */}
      <div className="space-y-3">
  {noDataMessage ? (
    <p style={{ color: 'red', fontWeight: 'bold' }}>{noDataMessage}</p>
  ) : (
    <>
      <p className="text-sm text-gray-500 mb-2">Available Time Slots:</p>
      {timeSlotsMap[selectedDateKey]?.map((slot) => (
        <label key={slot as string} className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name="slot"
            value={slot as string}
            checked={selectedSlot === slot}
            onChange={() => setSelectedSlot(slot as string)}
            className="form-radio text-blue-600"
          />
          {slot}
        </label>
      ))}
    </>
  )}
</div>

      {/* Accept Button */}
      {selectedSlot && (
        // <button className="mt-6 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700" onClick={() => setIsBooked(true)}>
        //   Book {selectedSlot}
        // </button>
        <button className="mt-6 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700" onClick={handleBooking}>
         Book {selectedSlot}
        </button>
        
      )}
    </div>

    
 


{/*         
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: "prev,next",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={events}
          selectable={true}
          select={handleDateSelect}
          eventClick={handleEventClick}
          eventContent={renderEventContent}
          // customButtons={{
          //   addEventButton: {
          //     text: "Add Event +",
          //     click: openModal,
          //   },
          // }}
        /> */}
      </div>

      {isBooked && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-99999">
    <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg text-center">
      <h2 className="text-xl font-bold text-green-600 mb-2">Booking Confirmed!</h2>
      <p className="text-gray-700 mb-4">You’ve booked a session with <strong>{mentorname}</strong>.</p>

      <p className="text-sm text-gray-600">
        <strong>Time:</strong> {selectedSlot}<br />
        <strong>Date:</strong> {
          dates.find((d) => d.key === selectedDateKey)?.label
        }
      </p>

      <div className="mt-4">
        <p className="text-sm text-gray-500 mb-1">Join Zoom:</p>
        <a
          href={zoomLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline break-all"
        >
          {zoomLink}
        </a>
      </div>

      <button
        className="mt-6 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
        onClick={() => {
        setIsBooked(false);     // close modal
        router.push("/calendar"); // ✅ navigate
      }}
      >
        Close
      </button>
    </div>
  </div>
)}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        className="max-w-[700px] p-6 lg:p-10"
      >
        <div className="flex flex-col px-2 overflow-y-auto custom-scrollbar">
          <div>
            <h5 className="mb-2 font-semibold text-gray-800 modal-title text-theme-xl dark:text-white/90 lg:text-2xl">
              {selectedEvent ? "Mentor Profile" : "Mentor Profile"}
            </h5>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Check out the slots and get started with your mentoring session.
            </p>
          </div>
          <div className="mt-8">
            <div>
              <div>
                <label className="mb-1.5 block text-lg font-medium text-gray-700 dark:text-gray-400">
                  Mentor's Name
                </label>
                <b style={{fontSize: "21px"}}>{mentorname}</b>
              </div>
            </div>
            <div className="mt-6">
              <label className="block mb-4 text-lg font-medium text-gray-700 dark:text-gray-400">
                Available Time Slots:
              </label>
              <div className="flex flex-wrap items-center gap-4 sm:gap-5">
                {Object.entries(calendarsEvents).map(([key, value]) => (
                  <div key={key} className="n-chk">
                    <div
                      className={`form-check form-check-${value} form-check-inline`}
                    >
                      <label
                        className="flex items-center text-sm text-gray-700 form-check-label dark:text-gray-400"
                        htmlFor={`modal${key}`}
                      >
                        <span className="relative">
                          <input
                            className="sr-only form-check-input"
                            type="radio"
                            name="event-level"
                            value={key}
                            id={`modal${key}`}
                            checked={eventLevel === key}
                            onChange={() => setEventLevel(key)}
                          />
                          <span className="flex items-center justify-center w-5 h-5 mr-2 border border-gray-300 rounded-full box dark:border-gray-700">
                            <span
                              className={`h-2 w-2 rounded-full bg-white ${
                                eventLevel === key ? "block" : "hidden"
                              }`}  
                            ></span>
                          </span>
                        </span>
                        {value}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <label className="mb-1.5 block text-lg font-medium text-gray-700 dark:text-gray-400">
                Join the Zoom Link
              </label>
              <div className="relative">
                <b style={{fontSize: "21px"}}><a
  href="https://zoom.us/j/1234567890?pwd=dummyzoomlink"
  target="_blank"
  rel="noopener noreferrer"
  className="text-blue-600 underline hover:text-blue-800"
>
  https://zoom.us/j/1234567890?pwd=dummyzoomlink
</a></b>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 mt-6 modal-footer sm:justify-end">
            <button
              onClick={closeModal}
              type="button"
              className="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto"
            >
              Close
            </button>
            <button
              onClick={handleAddOrUpdateEvent}
              type="button"
              className="btn btn-success btn-update-event flex w-full justify-center rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-600 sm:w-auto"
            >
              {selectedEvent ? "Accept" : "Accept"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const renderEventContent = (eventInfo: EventContentArg) => {
  const colorClass = `fc-bg-${eventInfo.event.extendedProps.calendar.toLowerCase()}`;
  const tooltipContent = `Mentor: Manasa Manpadi\nAvailable Slots:\n- 10:00 AM – 11:00 AM\n- 12:00 PM – 01:00 PM\n- 03:00 PM – 04:00 PM\n Click and see all Details`;
  return (
    <div
      className={`event-fc-color flex fc-event-main ${colorClass} p-1 rounded-sm`}
      title={tooltipContent}
    >
      <div className="fc-daygrid-event-dot"></div>
      {/* <div className="fc-event-time">{eventInfo.timeText}</div> */}
      <div className="fc-event-title">{eventInfo.event.title}</div>
    </div>
  );
};

export default Calendar;
