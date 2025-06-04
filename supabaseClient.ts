import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mcotdjwbuonaekscxbxa.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1jb3RkandidW9uYWVrc2N4YnhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg5MjU0NTcsImV4cCI6MjA2NDUwMTQ1N30.JFBrMb8k9zvM2q7ZhFoRSS35z87Wku2wQO-gWbdI1Pk';

export const supabase = createClient(supabaseUrl, supabaseKey);

