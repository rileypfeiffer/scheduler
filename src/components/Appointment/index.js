import React from "react";
import "components/Appointment/styles.scss"
import Show from "./Show";
import Empty from "./Empty";
import useVisualMode from "hooks/useVisualMode";
import Form from "./Form";
import Confirm from "./Confirm";
import Error from "./Error";
import Status from "./Status";

export default function Appointment(props) {

  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";
  const EDIT = "EDIT";
  const ERROR_SAVE = "ERROR_SAVE";
  const ERROR_DELETE = "ERROR_DELETE";

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {

    if (name && interviewer) {
      transition(SAVING);

      const interview = {
        student: name,
        interviewer
      };

      props.bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch(() => transition(ERROR_SAVE, true))
    }
  }

  function deleteInterview(student, interviewer) {
      transition(DELETING, true);

      const interview = {
        student,
        interviewer
      };

      props.cancelInterview(props.id, interview)
      .then(() => transition(EMPTY))
      .catch(error => transition(ERROR_DELETE, true))
    }

  function edit() {
    transition(EDIT);
  }

  return (
    <article className="appointment">
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={deleteInterview}
          onEdit={edit}
        />
      )}
      {mode === EDIT && (
        <Form
        name={props.name ? props.name : props.interview.student}
        value={props.value ? props.value : props.interview.interviewer.id}
        interviewers={props.interviewers}
        onSave={save}
        onCancel={back}
        />
      )}
      {mode === CREATE && (
        <Form
          name={props.name}
          value={props.value}
          interviewers={props.interviewers}
          onSave={save}
          onCancel={back}
        />
      )}
      {mode === SAVING && <Status message={"Saving"} />}
      {mode === DELETING && <Status message={"Deleting"} />}
      {mode === CONFIRM && <Confirm
        onCancel={() => back()}
        message={"Are you sure you want to delete?"}
        onConfirm={deleteInterview}
      />}
      {mode === ERROR_SAVE && <Error message={"Could not create appointment"}
        onClose={() => back()}
      />}
      {mode === ERROR_DELETE && <Error message={"Could not cancel appointment"}
        onClose={() => back()}
      />}
    </article>
  )
}