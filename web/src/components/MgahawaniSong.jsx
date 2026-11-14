import React from "react";
import WorkbookDayMusic from "./WorkbookDayMusic";
import SwahiliRestaurantSongQuestions from "./SwahiliRestaurantSong";

export default function MgahawaniSong() {
  return <>
    <WorkbookDayMusic level="A1" day={6} program="swahili" compact hideLegacyNotes />
    <SwahiliRestaurantSongQuestions />
  </>;
}
