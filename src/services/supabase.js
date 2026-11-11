import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ylsptxbzueaooofgqaug.supabase.co';

const supabaseKey = 'sb_publishable_zFDFwZa1QYSLoeEBevM2Tg_UMjmj7rM';

export const supabaseConfigOk = true;

export const supabase = createClient(supabaseUrl, supabaseKey);
