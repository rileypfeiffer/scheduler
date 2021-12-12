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
  let interviewersArray = [];

  state.days.map(function(dayObject) {
    if (dayObject.name === day) {
      for (let interview of dayObject.interviewers) {
        interviewersArray.push(interview);
      }
    }
    return interviewersArray;
  })
  const dayInterviewers = match(state.interviewers, interviewersArray);
  return dayInterviewers;
}