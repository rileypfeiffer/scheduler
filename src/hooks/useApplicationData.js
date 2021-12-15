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

  const appointment = {
    ...state.appointments[id],
    interview: { ...interview }
  };

  const appointments = {
    ...state.appointments,
    [id]: appointment
  };

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
    setState({
      ...state,
      appointments
    });
    return axios.put(`/api/appointments/${id}`, {interview})
  }

  function cancelInterview(id, interview) {
    setState({
      ...state,
      appointments
    });
    return axios.delete(`/api/appointments/${id}`, interview)
  }
  return { state, setDay, bookInterview, cancelInterview }
}