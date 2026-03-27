"use client";
import moment from "moment";
import { TournamentDetail } from "../types/common/types";

export const tournamentOverview = (detail: TournamentDetail | null) => {
  const isPaid = detail?.type === "PAID";
  return [
    { value: isPaid ? `${parseInt(detail.price) ?? "0"} CREDITS` : "TYPE", label: detail?.type, src: isPaid ? '/clash/data_usage.svg' : "/clash/filter_tilt_shift.svg" },
    {
      label: "START DATE",
      value: detail?.start_date ? moment(detail.start_date).format("DD/MM/YYYY") : "-",
      src: "/clash/hourglass_top.svg",
    },
    {
      label: "END DATE",
      value: detail?.end_date ? moment(detail.end_date).format("DD/MM/YYYY") : "-",
      src: "/clash/hourglass_empty.svg",
    },
    {
      label: "RIDDLES",
      value: detail?.riddles?.toString() || "-",
      src: "/clash/extension.svg",
    },
    { label: "USERS", value: detail?.users?.toString() || "-", src: "/clash/world.svg" },
    { label: "Prize Money", value: detail?.prize_money?.toString() || "-", src: "/clash/money_bag.svg" },
  ];
};

export const hardNavigate = (to: string) => {
  window.location.href = to;
};

export const getTournamentTimeInfo = (
  startDate: string,
  endDate: string,
  status: "SCHEDULED" | "LIVE" | "CONCLUDED",
  userHasJoined: boolean
): { phase: string; message: string; canPlay: boolean; buttonText: string; buttonDisabled: boolean } => {
  const start = moment(startDate);
  const end = moment(endDate);
  const now = moment();

  const formatWithGMT = (date: moment.Moment) => {
    const offset = date.format("Z");
    const gmt = `GMT${offset}`;
    return `${date.format("DD, MMM YYYY HH:mm")} ${gmt}`;
  };

  if (status === "SCHEDULED") {
    const diff = moment.duration(start.diff(now));
    const hours = Math.floor(diff.asHours());
    const minutes = diff.minutes();
    const formattedDate = formatWithGMT(start);

    const message =
      hours <= 0 && minutes > 0
        ? `Starts in ${minutes} ${minutes === 1 ? "minute" : "minutes"} | ${formattedDate}`
        : hours > 0
          ? `Starts in ${hours} ${hours === 1 ? "hour" : "hours"} and ${minutes} ${minutes === 1 ? "minute" : "minutes"} | ${formattedDate}`
          : `Starts soon | ${formattedDate}`;

    return {
      phase: "SCHEDULED",
      message,
      canPlay: false,
      buttonText: userHasJoined ? "Leave" : "Join Now",
      buttonDisabled: false,
    };
  }

  if (status === "LIVE") {
    const diff = moment.duration(end.diff(now));
    const hours = Math.floor(diff.asHours());
    const minutes = diff.minutes();
    const formattedDate = formatWithGMT(end);

    const message =
      hours <= 0 && minutes > 0
        ? `Ends in ${minutes} ${minutes === 1 ? "minute" : "minutes"} | ${formattedDate}`
        : hours > 0
          ? `Ends in ${hours} ${hours === 1 ? "hour" : "hours"} and ${minutes} ${minutes === 1 ? "minute" : "minutes"} | ${formattedDate}`
          : `Ending soon | ${formattedDate}`;

    return {
      phase: "LIVE",
      message,
      canPlay: userHasJoined,
      buttonText: userHasJoined ? "Play" : "Join Now",
      buttonDisabled: false,
    };
  }

  const formattedDate = formatWithGMT(end);
  return {
    phase: "CONCLUDED",
    message: `Tournament ended | ${formattedDate}`,
    canPlay: false,
    buttonText: "Ended",
    buttonDisabled: true,
  };
};

export const getHintIcon = (hintType: string | undefined) => {
  switch (hintType) {
    case "general_hint":
      return "bg-[url('/payments/filter_tilt.svg')]";
    case "intermediate_hint":
      return "bg-[url('/payments/intermediate.svg')]";
    case "final_hint":
      return "bg-[url('/payments/final.svg')]";
    default:
      return "bg-[url('/riddles/helper_cross.svg')]";
  }
};

export const formatHintType = (type: string | undefined) => {
  if (!type) return "";
  return type
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const addClickableEventByRiddleId = (level_id: number, backgroundLayer: HTMLDivElement, solutionSubmitter: () => unknown) => {
  const element = document.createElement('div');
  const tw = String.raw;

  switch (level_id) {
    case 1:
      element.className = tw`
        absolute
        rounded-full
        bg-transparent
        aspect-square

        w-[calc(200/375*100vw)]
        top-[calc(323/812*100vh)]
        left-[calc(50/375*100vw)]

        sm:w-[calc(200/1280*100vw)]
        sm:top-[calc(310/835*100vh)]
        sm:left-[calc(498/1280*100vw)]
      `;
      break;

    case 10:
    case 20:
    case 30:
    case 40:
      element.className = tw`absolute inset-0 ml-[calc(40/1280*100vw)] bg-transparent`;
      break;

    default:
      element.remove();
      return;
  }

  element.addEventListener('click', async () => {
    await solutionSubmitter();
  });

  backgroundLayer.appendChild(element);
};
