const validGrades = new Set(['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12']);
const validTeamSizes = new Set(['2', '3', '4', 2, 3, 4]);

export function normalizeEmail(value = '') {
  return String(value).trim().toLowerCase();
}

export function validateRegistration(input = {}) {
  const fullName = String(input.fullName ?? '').trim();
  const email = normalizeEmail(input.email);
  const phone = String(input.phone ?? '').trim();
  const school = String(input.school ?? '').trim();
  const grade = String(input.grade ?? '').trim();
  const teamName = String(input.teamName ?? '').trim();
  const teamSize = String(input.teamSize ?? '').trim();
  const additionalInfo = String(input.additionalInfo ?? '').trim();
  const website = String(input.website ?? '').trim();
  const errors = {};

  if (website) errors.website = 'Spam protection triggered.';
  if (!fullName || fullName.length < 2 || fullName.length > 120) errors.fullName = 'Enter the designated team contact’s full name.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 160) errors.email = 'Enter a valid email address.';
  if (phone.length > 40) errors.phone = 'Keep the phone number under 40 characters.';
  if (!school || school.length < 2 || school.length > 160) errors.school = 'Enter your school.';
  if (!validGrades.has(grade)) errors.grade = 'Choose a grade from 9 to 12.';
  if (!teamName || teamName.length < 2 || teamName.length > 120) errors.teamName = 'Enter your team name.';
  if (!validTeamSizes.has(input.teamSize) && !validTeamSizes.has(teamSize)) errors.teamSize = 'Choose a team size from 2 to 4.';
  if (additionalInfo.length > 1000) errors.additionalInfo = 'Keep additional information under 1,000 characters.';

  return {
    ok: Object.keys(errors).length === 0,
    errors,
    data: { fullName, email, phone, school, grade, teamName, teamSize, additionalInfo }
  };
}
