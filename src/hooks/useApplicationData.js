import { useState, useEffect } from "react";
import axios from "axios";
import "components/Application.scss";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState({ ...state, day });

  useEffect(() => {
    Promise.all([
      axios.get('/api/days'),
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((all) => {
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data, interviewers: all[2].data }));
    });
  }, []);

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
  
    return axios.put(`/api/appointments/${id}`, {interview})
    .then(() => {
      setState((prev) => {
        const days = updateSpots(state, "bookAppointment");
        return { 
          ...prev,
          appointments,
          days
        };
      }); 
    });
  }

  function cancelInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return axios.delete(`/api/appointments/${id}`, {interview})
    .then(() => {
      setState((prev) => {
        const days = updateSpots(state);
        return { 
          ...prev,
          appointments,
          days
        };
      });   
    });
  }

  function updateSpots(state, requestType) {
    const days = state.days.map(day => {
      if (day.name === state.day) {
        if (requestType === "bookAppointment") {
          return { ...day, spots: day.spots - 1 };
        } else {
          return { ...day, spots: day.spots + 1 };
        }
      } else {
        return { ...day };
      }
    })
    return days;
  }

  return {state, setDay, bookInterview, cancelInterview}
}