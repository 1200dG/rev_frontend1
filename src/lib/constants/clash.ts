import {
  Column,
  LeaderBoardColumns,
  TournamentLeaderboardColumns,
  PrizeTableColumns,
} from "../types/common/types";

export const leaderBordData = [
  { rank: "11", username: "Ali", totalPoints: "4", wins: "1", streak: "1" },
  {
    rank: "12",
    username: "Ali Haider",
    totalPoints: "24",
    wins: "1",
    streak: "1",
  },
  {
    rank: "12",
    username: "Ali Haider",
    totalPoints: "24",
    wins: "1",
    streak: "1",
  },
  {
    rank: "12",
    username: "Ali Haider",
    totalPoints: "24",
    wins: "1",
    streak: "1",
  },
  {
    rank: "12",
    username: "Ali Haider",
    totalPoints: "24",
    wins: "1",
    streak: "1",
  },
  {
    rank: "12",
    username: "Ali Haider",
    totalPoints: "24",
    wins: "1",
    streak: "1",
  },
  {
    rank: "12",
    username: "Ali Haider",
    totalPoints: "24",
    wins: "1",
    streak: "1",
  },
  {
    rank: "12",
    username: "Ali Haider",
    totalPoints: "24",
    wins: "1",
    streak: "1",
  },
];

export const leaderBoardTableColumns: Column<LeaderBoardColumns>[] = [
  { header: "RANK", accessor: "rank" },
  { header: "USER", accessor: "username" },
  { header: "Total Points", accessor: "totalPoints" },
  { header: "WINS", accessor: "wins" },
  { header: "STREAK", accessor: "streak" },
];

export const tournamentLeaderBoardColumns: Column<TournamentLeaderboardColumns>[] =
  [
    { header: "RANK", accessor: "rank" },
    { header: "USER", accessor: "username" },
    { header: "LEVEL", accessor: "level" },
    { header: "TOTAL POINTS", accessor: "totalPoints" },
  ];

export const tournamentLeaderBoardData = [
  { rank: "11", username: "Ali", totalPoints: "4", level: "1" },
  { rank: "13", username: "Umer", totalPoints: "4", level: "1" },
  { rank: "14", username: "Jamal", totalPoints: "24", level: "1" },
  { rank: "15", username: "Hamza", totalPoints: "4", level: "1" },
  { rank: "16", username: "Ali Haider", totalPoints: "24", level: "1" },
];

export const leaderboardFilters = [
  { label: "World", value: "world", src: "/clash/world.svg", a_src: "/clash/a_world.svg" },
  { label: "My Country", value: "my_country", src: "/clash/flag.svg", a_src: "/clash/a_flag.svg" },
  { label: "Top Rank", value: "top_rank", src: "/clash/trophy.svg", a_src: "/clash/a_trophy.svg" },
  { label: "Reset", value: "reset", src: "/clash/undo.svg", a_src: "/clash/a_undo.svg" },
];

export const prizeTableData = [
  {
    rank: "1",
    badge: "/clash/Badge1.svg",
    username: "To Be Determined",
    leaderboardPoints: "2000",
    cashPrize: "$1.00",
  },
  {
    rank: "2",
    badge: "/clash/Badge2.svg",
    username: "To Be Determined",
    leaderboardPoints: "2000",
    cashPrize: "$1.00",
  },
  {
    rank: "3",
    badge: "/clash/Badge3.svg",
    username: "To Be Determined",
    leaderboardPoints: "2000",
    cashPrize: "$1.00",
  },
  {
    rank: "4-10",
    username: "To Be Determined",
    leaderboardPoints: "2000",
    cashPrize: "$1.00",
  },
];

export const gameHubLeaderBoardData: LeaderBoardColumns[] = [
  {
    username: "Alice",
    rank: "1",
    badge: "/clash/Badge1.svg",
    totalPoints: "1500",
    wins: "12",
    streak: "5",
  },
  {
    username: "Border",
    rank: "2",
    badge: "/clash/Badge2.svg",
    totalPoints: "1500",
    wins: "12",
    streak: "5",
  },
  {
    username: "Liner",
    rank: "3",
    badge: "/clash/Badge3.svg",
    totalPoints: "1500",
    wins: "12",
    streak: "5",
  },
  {
    username: "Bob",
    rank: "4-10",
    totalPoints: "1100",
    wins: "9",
    streak: "3",
  },
];

export const tournamentPrizeCols: Column<PrizeTableColumns>[] = [
  { header: "RANK", accessor: "rank" },
  { header: "USER", accessor: "username" },
  { header: "LEADERBOARD POINTS", accessor: "leaderboardPoints" },
  { header: "CASH PRIZE", accessor: "cashPrize" },
];

export const stats = [
  { label: "Ranking", value: "1030" },
  { label: "Points", value: "70K" },
  { label: "Wins", value: "1" },
  { label: "Streak", value: "9999" },
  { label: "Hints", value: "9" },
  { label: "Lives", value: "2" },
];

export const myStats = {
  tournaments: [
    { value: "100", label: "Wins" },
    { value: "12", label: "Top 3" },
    { value: "20", label: "Top 10" },
    { value: "30", label: "Top 100" },
    { value: "50", label: "Best Position" },
  ],
  rankings: [
    { value: "100", label: "Current Rank" },
    { value: "12", label: "Best Rank" },
  ],
  other: [
    { value: "100", label: "Number of Tournaments" },
    { value: "12", label: "Total Hours" },
    { value: "20", label: "Average Time Per Riddle" },
    { value: "30", label: "Total Hints" },
    { value: "50", label: "Total Lives" },
  ],
};
