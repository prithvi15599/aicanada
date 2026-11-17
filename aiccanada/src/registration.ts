export type Grade = 'Grade 9' | 'Grade 10' | 'Grade 11' | 'Grade 12';
export type TeamSize = '2' | '3' | '4';

export type RegistrationPayload = {
  fullName: string;
  email: string;
  phone?: string;
  school: string;
  grade: Grade | '';
  teamName: string;
  teamSize: TeamSize | '';
  additionalInfo?: string;
  website?: string;
};

export type RegistrationStatus = 'idle' | 'submitting' | 'success' | 'error';

export async function getRegistrationStatus(): Promise<{ configured: boolean }> {
  const response = await fetch('/api/registration-status', { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error('Unable to check registration setup.');
  return response.json() as Promise<{ configured: boolean }>;
}

export async function submitRegistration(payload: RegistrationPayload) {
  const response = await fetch('/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = (await response.json().catch(() => ({}))) as { message?: string; code?: string };
  if (!response.ok) {
    const error = new Error(data.message || 'We could not save your registration. Please try again.');
    (error as Error & { code?: string }).code = data.code;
    throw error;
  }
  return data;
}
