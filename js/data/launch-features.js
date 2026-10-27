// One switch source for the simple public release. Preserve the complete
// Equalizer and Hachuha implementations; re-enable only after acceptance.
export const launchFeatures = Object.freeze({
  adaptivePresentation: false, // site settings, not the standalone PDF
  hachuha: false,              // contextual floating helper
  contextualEntryExamples: false, // legacy inserts are not edited for approved articles
  illustrationTrialBlockId: null, // rejected Astra illustration trial disabled; source assets retained
  telegramIllustrationTrialNodeId: 'VERIFY_RESULT', // one unapproved post-07 visual trial only
  semanticMap: true            // normal site map stays available
});
export const fixedPublicPresentation = Object.freeze({
  level: 'beginner', detail: 'normal', helper: 'off'
});
// Historical visitor choices remain in storage but cannot affect launch copy.
export function publicPresentationSettings(settings = {}) {
  return {
    ...settings,
    ...(launchFeatures.adaptivePresentation ? {} : {
      level: fixedPublicPresentation.level,
      detail: fixedPublicPresentation.detail
    }),
    helper: launchFeatures.hachuha ? (settings.helper || 'normal') : 'off'
  };
}
