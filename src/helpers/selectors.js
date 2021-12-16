const match = function(field, matchedIDs) {
  const matched = matchedIDs.map(id => field[id]);
  return matched;
}

export function getAppointmentsForDay(state, day) {
  let appointmentsArray = [];

  state.days.map(function(dayObject) {
    if (dayObject.name === day) {
      for (let appointment of dayObject.appointments) {
        appointmentsArray.push(appointment);
      }
    }
    return appointmentsArray;
  })
  const dayAppointments = match(state.appointments, appointmentsArray);
  return dayAppointments;
}

export function getInterview(state, interview) {
  if(!interview) {
    return null;
  }

  const interviewerData = state.interviewers[interview.interviewer];

  return {student: interview.student, interviewer: interviewerData};
}

export function getInterviewersForDay(state, day) {
  const filterByDay = state.days.find(dayObj => dayObj.name === day);

  if (!state.days.length || !filterByDay) {
    return [];
  } else {
    return filterByDay.interviewers.map((id) => state.interviewers[id]);
  }
};