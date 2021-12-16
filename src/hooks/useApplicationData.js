import { useState, useEffect } from "react";
import axios from "axios";
import "components/Application.scss";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {}
  });

  const setDay = day => setState({ ...state, day });

  useEffect(() => {
    Promise.all([
      Promise.resolve(axios.get('http://localhost:8001/api/days')),
      Promise.resolve(axios.get('http://localhost:8001/api/appointments')),
      Promise.resolve(axios.get('http://localhost:8001/api/interviewers'))
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
  
    setState((prev) => {
      const remainingSpots = updateSpotsRemaining(prev, appointments);
      return {
        ...prev,
        appointments,
        days: remainingSpots
      };
    });
    return axios.put(`/api/appointments/${id}`, {interview})
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

    setState((prev) => {
      const remainingSpots = updateSpotsRemaining(prev, appointments);
      return {
        ...state,
        appointments,
        days: remainingSpots
      }
    });
    return axios.delete(`/api/appointments/${id}`, interview)
  }

  function updateSpotsRemaining(state, appointments) {
    let remainingSpots = 0;
    const day = state.days.find((day) => day.name === state.day);

    for(const appointmentID of day.appointments) {
      if (appointments[appointmentID].interview === null) {
        remainingSpots++;
      }
    }

    const vacantDay = { ...day, remainingSpots };
    const daysArray = state.days.map((day) => (day.name === state.day ? vacantDay : day));
    return daysArray;
  }
  return { state, setDay, bookInterview, cancelInterview, updateSpotsRemaining }
}