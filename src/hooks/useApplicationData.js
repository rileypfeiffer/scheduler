import React, { useState, useEffect } from "react";
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
      }
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
        appointments
      }
    });
    return axios.delete(`/api/appointments/${id}`, interview)
  }

  function updateSpotsRemaining(state, id) {
    let remainingSpots = 0;
    const day = state.days.filter((element) =>
    element.appointments.includes(id)
    );

    let dayArray = day[0];

    for(const appointmentID of dayArray.appointments) {
      if (state.appointments[appointmentID].interview === null) {
        remainingSpots++;
      }
    }

    const vacantDay = { ...dayArray, spots };
    const index = state.days.findIndex(day => day.name === dayArray.name);
    state.days[index] = vacantDay;
    setState(state);
  }
  return { state, setDay, bookInterview, cancelInterview, updateSpotsRemaining }
}