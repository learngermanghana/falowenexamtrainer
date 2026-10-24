import React from 'react';
import ListeningPracticeSamplePage from './ListeningPracticeSamplePage';
import { A1_MOCK_3_ID, A1_MOCK_3_LISTENING } from '../data/a1FinalMock3Data';

// Render the existing Hören Sample 3 bank and authenticated audio within Mock 3.
// The mockId gives submissions their own result identity, without copying sample questions.
export default function A1Mock3Listening() {
  return (
    <section data-a1-mock3-hoeren>
      <ListeningPracticeSamplePage
        level="A1"
        sampleId={A1_MOCK_3_LISTENING.sampleId}
        mockId={A1_MOCK_3_ID}
      />
    </section>
  );
}
