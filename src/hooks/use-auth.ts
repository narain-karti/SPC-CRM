"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import type { Role } from "@/lib/supabase/types";

export interface UserProfile {
  id: string;
  authId: string;
  orgId: string;
  branchId: string | null;
  role: Role;
  name: string;
  email: string;
  phone: string | null;
  avatarColor: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Get initial session
    async function getSession() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);

        if (user) {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("*")
            .eq("auth_id", user.id)
            .single();

          if (profileData) {
            setProfile({
              id: profileData.id,
              authId: profileData.auth_id,
              orgId: profileData.org_id,
              branchId: profileData.branch_id,
              role: profileData.role as Role,
              name: profileData.name,
              email: profileData.email,
              phone: profileData.phone,
              avatarColor: profileData.avatar_color,
            });
          }
        }
      } catch (error) {
        console.error("Auth error:", error);
      } finally {
        setIsLoading(false);
      }
    }

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          setUser(session.user);
          const { data: profileData } = await supabase
            .from("profiles")
            .select("*")
            .eq("auth_id", session.user.id)
            .single();

          if (profileData) {
            setProfile({
              id: profileData.id,
              authId: profileData.auth_id,
              orgId: profileData.org_id,
              branchId: profileData.branch_id,
              role: profileData.role as Role,
              name: profileData.name,
              email: profileData.email,
              phone: profileData.phone,
              avatarColor: profileData.avatar_color,
            });
          }
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setProfile(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  async function updateProfile(updates: Partial<UserProfile>) {
    if (!profile) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        name: updates.name,
        phone: updates.phone,
        avatar_color: updates.avatarColor,
        branch_id: updates.branchId,
      })
      .eq("id", profile.id);

    if (!error && updates) {
      setProfile({ ...profile, ...updates });
    }

    return { error };
  }

  return {
    user,
    profile,
    isLoading,
    isAuthenticated: !!user,
    signOut,
    updateProfile,
  };
}
