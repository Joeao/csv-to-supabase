import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/data/schema";

export default (): SupabaseClient<Database> => {
	return createClient<Database>(import.meta.env.VITE_supabase_url, import.meta.env.VITE_supabase_key, {
		db: { schema: "public" },
	});
};
