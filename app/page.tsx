"use client";
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";

interface DiscordUser {
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
  global_name: string;
}

interface Activity {
  name: string;
  state?: string;
  details?: string;
  type: number;
}

interface LanyardData {
  discord_user: DiscordUser;
  discord_status: string;
  activities: Activity[];
}

interface TeamMember {
  id: string;
  role: string;
  description?: string;
}

interface TeamMemberData extends LanyardData {
  role: string;
  description?: string;
}

const StatusIndicator = ({ status }: { status: string }) => {
  const [currentStatus, setCurrentStatus] = useState(status);

  useEffect(() => {
    let ws: WebSocket | null = null;
    let isMounted = true;
    const userId = "874898422233178142"; 
    function connect() {
      ws = new WebSocket(`wss://api.lanyard.rest/socket`);
      ws.onopen = () => {
        ws?.send(
          JSON.stringify({
            op: 2,
            d: { subscribe_to_id: userId },
          })
        );
      };
      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (
          data.t === "INIT_STATE" ||
          data.t === "PRESENCE_UPDATE"
        ) {
          const newStatus = data.d.discord_status;
          if (isMounted && newStatus && newStatus !== currentStatus) {
            setCurrentStatus(newStatus);
          }
        }
      };
      ws.onclose = () => {
        // Try to reconnect after a delay
        setTimeout(connect, 5000);
      };
    }
    connect();
    return () => {
      isMounted = false;
      ws?.close();
    };
  }, []);

  const statusColors = {
    online: "bg-green-500",
    idle: "bg-yellow-500",
    dnd: "bg-red-500",
    offline: "bg-gray-500",
  };

  return (
    <div
      className={`absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-4 border-[#1a1025] ${
        statusColors[currentStatus as keyof typeof statusColors] ||
        statusColors.offline
      }`}
    />
  );
};

const TeamMemberCard = ({ data }: { data: TeamMemberData }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
      <div className="relative bg-[#1a1025]/40 backdrop-blur-xl rounded-2xl border border-purple-500/10 p-6 hover:border-purple-500/20 transition-all duration-300 h-full">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-r">
              <img
                src={`https://cdn.discordapp.com/avatars/${data.discord_user.id}/${data.discord_user.avatar}`}
                alt={data.discord_user.username}
                className="w-full h-full rounded-xl object-cover"
                loading="lazy"
              />
            </div>
            <StatusIndicator status={data.discord_status} />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-200 to-purple-100 text-transparent bg-clip-text">
              {data.discord_user.global_name}
            </h3>
            <p className="text-purple-300/60">@{data.discord_user.username}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20">
                {data.role}
              </span>
            </div>
          </div>
        </div>
        {data.description && (
          <p className="mt-4 text-purple-200/70 text-sm">{data.description}</p>
        )}
      </div>
    </motion.div>
  );
};

export default function AboutPage() {
  const [teamData, setTeamData] = useState<{ [key: string]: TeamMemberData }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const teamMembers: TeamMember[] = useMemo(
    () => [
      {
        id: "874898422233178142",
        role: "Lead Developer",
        description:
          "Responsible for application architecture and frontend development. Experienced in React, Next.js, and TypeScript.",
      }
    ],
    []
  );

  useEffect(() => {
    const fetchLanyardData = async () => {
      setLoading(true);
      try {
        const results = await Promise.all(
          teamMembers.map(async (member) => {
            const res = await fetch(`https://api.lanyard.rest/v1/users/${member.id}`);
            if (!res.ok) throw new Error("Failed to fetch Lanyard data");
            const response = await res.json();
            if (response.success) {
              return {
                ...response.data,
                role: member.role,
                description: member.description,
              };
            }
            return null;
          })
        );
        const data: { [key: string]: TeamMemberData } = {};
        results.forEach((item) => {
          if (item) {
            data[item.discord_user.id] = item;
          }
        });
        setTeamData(data);
        setError(null);
      } catch (err) {
        setError("Failed to load team data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchLanyardData();
  }, [teamMembers]);

  return (
    <div className="relative min-h-screen">
      <div className="relative z-10 min-h-screen bg-transparent">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="h-[40vh] flex items-center justify-center relative overflow-hidden"
        ></motion.div>

        {/* Team Section */}
        <div className="max-w-6xl mx-auto px-4 -mt-20 pb-20">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : error ? (
            <div className="text-center p-8 bg-red-500/20 rounded-2xl border border-red-500/20">
              <p className="text-white">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Object.values(teamData).map((data) => (
                <TeamMemberCard key={data.discord_user.id} data={data} />
              ))}
            </div>
          )}

          {/* About Project Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-24 p-8 bg-[#1a1025]/40 backdrop-blur-xl rounded-2xl border border-purple-500/10"
          >
            <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-purple-300 to-pink-300 text-transparent bg-clip-text">
              About Elystra
            </h2>
            <p className="text-purple-200/80 text-center max-w-3xl mx-auto">
              This project is under development.
            </p>
          </motion.div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-20 text-center space-y-6"
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-purple-200/80">We're Online</span>
            </div>
            <div className="flex justify-center space-x-6">
              <a
                href="https://discord.gg/TSdpyMMfrU "
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center space-x-2 text-purple-200/60 hover:text-purple-200 transition-colors"
              >
                <span className="group-hover:scale-110 transition-transform">
                  Discord
                </span>
              </a>
              <a
                href="https://github.com/4levy"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center space-x-2 text-purple-200/60 hover:text-purple-200 transition-colors"
              >
                <span className="group-hover:scale-110 transition-transform">
                  GitHub
                </span>
              </a>
              <a
                href="mailto:contact@........."
                className="group flex items-center space-x-2 text-purple-200/60 hover:text-purple-200 transition-colors"
              >
                <span className="group-hover:scale-110 transition-transform">
                  Email
                </span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
