import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * API Route: Create User Profile
 * This route is called after successful signup to create the user profile
 * Uses service role key to bypass RLS policies
 */
export async function POST(request: NextRequest) {
  try {
    const { userId, email, fullName, phone, company } = await request.json();

    if (!userId || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create Supabase client with service role key
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: "Missing Supabase credentials" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Insert user profile (bypassing RLS with service role)
    const { error } = await supabase.from("users").insert({
      id: userId,
      email: email,
      full_name: fullName || null,
      phone: phone || null,
      company: company || null,
    });

    if (error) {
      // Check if it's a duplicate key error (trigger already created it)
      if (error.code === "23505") {
        return NextResponse.json(
          { message: "Profile already exists", created: false },
          { status: 200 }
        );
      }

      console.error("Error creating user profile:", error);
      return NextResponse.json(
        { error: "Failed to create user profile", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Profile created successfully", created: true },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in create-profile route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
