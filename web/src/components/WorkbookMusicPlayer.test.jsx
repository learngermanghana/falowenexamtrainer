import React from 'react';
import {render,screen,fireEvent} from '@testing-library/react';
import WorkbookMusicPlayer,{workbookLyricCues} from './WorkbookMusicPlayer';
import {A2_B1_WORKBOOK_TABS_WITH_GRAMMAR} from './StandardWorkbookComponents';
const song={id:'a2-day21',title:'Endlich Wochenende',objectKey:'music/a2/day-21/Endlich Wochenende.mp3',audioUrl:'https://www.falowen.app/api/music?track=a2-day21'};
const lyrics='[Verse]\nHallo Freunde\nWir fahren los';
const pack={objectKey:song.objectKey,lyrics,cues:[{text:'Hallo Freunde',start:2,end:4},{text:'Wir fahren los',start:6,end:8}],timingStatus:'estimated'};
test('modern player uses artwork, description and one audio for its timed lyric video',()=>{
 const {container}=render(<WorkbookMusicPlayer song={song} artwork="/music/covers/photos/journey.jpg" story={{storyEn:'A weekend adventure.'}} recording={pack} lyrics={lyrics} english={{lines:[{en:'Hello friends'},{en:'We set off'}]}} showEnglish />);
 expect(screen.getByAltText(/Song artwork/)).toHaveAttribute('src','/music/covers/photos/journey.jpg');
 expect(screen.getByText('A weekend adventure.')).toBeInTheDocument();
 expect(container.querySelectorAll('audio')).toHaveLength(1);
 const audio=container.querySelector('audio');expect(audio.preload).toBe('none');
 fireEvent.click(screen.getByRole('button',{name:'Watch lyric video'}));
 audio.currentTime=2.5;fireEvent.timeUpdate(audio);expect(screen.getByText('Hallo Freunde')).toBeInTheDocument();expect(screen.getByText('Hello friends')).toBeInTheDocument();
 audio.currentTime=5;fireEvent.seeked(audio);expect(screen.queryByText('Hallo Freunde')).toBeNull();
 audio.currentTime=6.1;fireEvent.timeUpdate(audio);expect(screen.getByText('Wir fahren los')).toBeInTheDocument();
 expect(screen.getByText(/Estimated line timing/)).toBeInTheDocument();
});
test('missing or mismatched cues do not invent line timings',()=>{
 expect(workbookLyricCues({...pack,cues:[pack.cues[0]]},lyrics)).toEqual([]);
 expect(workbookLyricCues({...pack,cues:[{...pack.cues[0],text:'Wrong'},pack.cues[1]]},lyrics)).toEqual([]);
 render(<WorkbookMusicPlayer song={song} artwork="/music/covers/photos/music.jpg" recording={{...pack,objectKey:'wrong'}} lyrics={lyrics} />);
 fireEvent.click(screen.getByRole('button',{name:'Watch lyric video'}));expect(screen.getByText(/Line highlighting is unavailable/)).toBeInTheDocument();
});
test('A2/B1 starts with Music then Grammar and Submit stays last',()=>{
 expect(A2_B1_WORKBOOK_TABS_WITH_GRAMMAR.slice(0,2).map(t=>t.key)).toEqual(['references','grammar']);expect(A2_B1_WORKBOOK_TABS_WITH_GRAMMAR.at(-1).key).toBe('submit');
});
