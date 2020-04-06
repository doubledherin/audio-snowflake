/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetAudioAnalysis
// ====================================================

export interface GetAudioAnalysis_audioAnalysis_track {
  __typename: "Track";
  duration: number | null;
  key: number | null;
  loudness: number | null;
  mode: number | null;
  tempo: number | null;
  timeSignature: number | null;
}

export interface GetAudioAnalysis_audioAnalysis_sections {
  __typename: "Section";
  key: number | null;
  mode: number | null;
  timeSignature: number | null;
}

export interface GetAudioAnalysis_audioAnalysis {
  __typename: "AudioAnalysis";
  track: GetAudioAnalysis_audioAnalysis_track | null;
  sections: (GetAudioAnalysis_audioAnalysis_sections | null)[] | null;
}

export interface GetAudioAnalysis {
  audioAnalysis: GetAudioAnalysis_audioAnalysis | null;
}

export interface GetAudioAnalysisVariables {
  trackId?: string | null;
}
