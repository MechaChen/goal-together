export const REWARD_AUDIO_SETTINGS_COPY = {
  title: "Reward Audio",
  description: "Upload custom sounds for normal rewards and bonus completions.",
  openButton: "Reward Audio",
  closeButton: "Close",
  chooseFileButton: "Choose file",
  previewButton: "Preview",
  uploadButton: "Upload",
  resetButton: "Reset",
  fileHint: "MP3 or WAV, up to 5 MB.",
  defaultStatus: "Using default app sound.",
  uploadPrompt: "Choose an audio file",
  sectionTitle: {
    normal: "Normal reward sound",
    bonus: "Bonus reward sound",
  },
  successUpload: "Reward audio updated.",
  successDelete: "Reward audio removed.",
} as const;

export const REWARD_AUDIO_SETTINGS_UI = {
  actionIconSize: 16,
} as const;
