export const routes = {
  ui: {
    root: "/",
    enigma: {
      seasonDetail: (id: string) => `/enigma/seasons/${id}`,
      seasonPlay: (id: string) => `/enigma/seasons/${id}/play`,
    },
    clash: {
      tournaments: "/clash/tournaments",
      tournamentDetail: (id: string) => `/clash/tournaments/${id}`,
      tournamentPlay: (id: string) => `/clash/tournaments/${id}/play`,
    },
    finance: "/finance",
    settings: "/settings",
    about: "/about",
    profile: "/profile",
    faq: "/faq",
    leaderboard: "/leaderboard",
    gamehub: "/gamehub",
    mystatistics: "/statistics",
    riddles: {
      index: "/riddles",
      riddle: (id: number) => `/riddles/${id}`,
      daily: "/riddles/daily",
    },
    auth: {
      signIn: "/auth/sign-in",
      signUp: "/auth/sign-up",
      veriFyEmail: "/auth/verify-email",
      forgotPassword: "/auth/forgot-password",
    },
    payments: {
      index: "/payments",
      purchase: "/payments/purchase",
      success: "/payments/success",
      cancel: "/payments/cancel",
    },
    admin: {
      dashboard: "/admin/dashboard",
      clash: "/admin/clash",
      enigma: "/admin/enigma",
      finance: "/admin/finance",
      riddles: "/admin/riddles",
    },
  },

  api: {
    auth: {
      verifyEmail: "email-verify",
      logIn: "login/",
      signUp: "signup/",
      socialLogin: "social-login/",
      guest: "guest-login/",
      forget: "password/forgot/",
      resetPassword: "password/reset/confirm/",
    },
    settings: {
      updateUser: "profile/settings/",
      checkUserName: "profile/username/",
      getSettings: "profile/settings/",
    },
    profile: {
      getProfile: "profile/design/",
      updateProfile: "profile/design/",
    },
    tournaments: {
      allTournaments: "tournaments/",
      tournamentDetail: (id: string) => `tournaments/${id}`,
      tournamentPlay: (accountId: string, tournamentId: string) => `tournament-play/?account_id=${accountId}&tournament_id=${tournamentId}`,
      tournamentSubmit: "tournament-play/submit/",
      tourPlay: "tour-play/",
    },
    riddles: {
      list: "riddles/",
      detail: (id: number) => `riddles/${id}/`,
      submit: "riddles/submit/",
      userPlay: (accountId: string) => `user-play/?account_id=${accountId}`,
      dailyPlay: "riddle-play/",
      userPlaySubmit: "user-play/",
      deductCredits: "find-hint/",
      getHintData: "redeem-hint/",
      addLives: "lives-add/",
    },
    admin: {
      riddles: {
        list: "admin-panel/riddles/",
        create: "admin-panel/riddles/",
        update: (id: number) => `admin-panel/riddles/${id}/`,
        delete: (id: number) => `admin-panel/riddles/${id}/`,
        import: "admin-panel/zip-upload/",
      },
      dailyRiddles: {
        create: "admin-panel/daily-riddles/",
      },
      tournaments: {
        list: "admin-panel/clash/",
        create: "admin-panel/clash/",
        update: (id: string) => `admin-panel/clash/${id}/`,
        delete: (id: number) => `admin-panel/clash/${id}/`,
        duplicate: (id: number) => `admin-panel/clash/${id}/duplicate-template/`,
        updateRiddleLevels: (id: number) => `admin-panel/clash/${id}/edit-levels/`,

      },
      seasons: {
        list: "admin-panel/enigma/",
        create: "admin-panel/enigma/",
        update: (id: number) => `admin-panel/enigma/${id}/`,
        delete: (id: number) => `admin-panel/enigma/${id}/`,
        updateRiddleLevels: (id: number) => `admin-panel/enigma/${id}/edit-levels/`,
      },
      users: {
        list: (status: string) => `admin-panel/users?status=${status}`,
        create: "admin-panel/users",
        update: (id: number) => `admin-panel/users/${id}/`,
        delete: (id: number) => `admin-panel/users/${id}/`,
      }
    },
    payment: {
      products: "product/",
      checkout: "stripe/checkout/",
      stripeData: (session_id: string) => `product-detail/?session_id=${session_id}`,
      paypal: "paypal/checkout/",
      paypalCapture: "paypal/capture/",
      transactionHistory: "user-transaction/",
    },
    faqs: {
      list: "faqs/",
      create: "faqs/",
      update: (id: number) => `faqs/${id}/`,
      delete: (id: number) => `faqs/${id}/`,
    },
  },
};