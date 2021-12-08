import React from "react";
import DayListItem from "./DayListItem";

export default function DayList(props) {
  const week = props.days.map(day => {
    return (
      <DayListItem key={props.id} name={props.name} spots={props.spots} selected={props.name === props.value} setDay={props.onChange} />
    )
  });
  return <ul>{week}</ul>;
};

