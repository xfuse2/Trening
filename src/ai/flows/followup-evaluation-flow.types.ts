export type FollowupEvaluationInput = {
  scenario: string;
  history: Array<{
    role: 'ai' | 'user';
    text: string;
  }>;
};

export type FollowupEvaluationOutput = {
  evaluation: string;
};
