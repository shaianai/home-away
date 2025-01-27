import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fhrsvollvyqdlhwhpeas.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZocnN2b2xsdnlxZGxod2hwZWFzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY5NzUxODMsImV4cCI6MjA1MjU1MTE4M30.NSX9prsx96fpZmEKttOFvZ_qgtXPUbb0kWNR6Z0An-c';

export const supabase = createClient(supabaseUrl, supabaseKey);

