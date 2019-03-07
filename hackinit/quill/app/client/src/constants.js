angular.module('reg')
    .constant('EVENT_INFO', {
        NAME: 'hack.init() 2018',
    })
    .constant('DASHBOARD', {
        UNVERIFIED: '我们已经向你的注册邮箱发送了验证邮件。完成验证后，申请通道将开放。',
        INCOMPLETE_TITLE: '你的申请仍未完成',
        INCOMPLETE: '如果你在 [APP_DEADLINE] 前无法完成申请，你将无法被组委会审查参赛资格。请尽快完成你的申请。',
        SUBMITTED: '我们欢迎你随时修改你的申请。但是，一旦申请结束，你将无法进一步编辑你的申请内容。\n 我们的申请将完全基于你提交的信息，请确保你提交的所有信息真实有效。',
        CLOSED_AND_INCOMPLETE_TITLE: '很抱歉，申请已经结束。',
        CLOSED_AND_INCOMPLETE: 'Since you have not completed your profile in time, your application will not be eligible for review.',
        ADMITTED_AND_CAN_CONFIRM_TITLE: '请在 [CONFIRM_DEADLINE] 前确认参赛',
        ADMITTED_AND_CANNOT_CONFIRM_TITLE: '你的参赛邀请已经失效',
        ADMITTED_AND_CANNOT_CONFIRM: '虽然我们为你提供了参赛资格，但是你并没有在参赛确认截止日期前确认。\n很遗憾，你将无法参加我们的活动。你的邀请已经提供给了等待名单上的其他申请者。\n希望在明年的活动中见到你！',
        CONFIRMED_NOT_PAST_TITLE: '你可以在 [CONFIRM_DEADLINE] 前修改你的确认信息。',
        DECLINED: '很遗憾，我们今年无法邀请你参加我们的活动 :(\n希望在明年的活动中见到你！',
    })
    .constant('TEAM',{
        NO_TEAM_REG_CLOSED: '团队注册已关闭',
    });
