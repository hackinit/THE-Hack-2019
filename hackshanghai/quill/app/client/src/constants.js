angular.module('reg')
    .constant('EVENT_INFO', {
        NAME: 'hackShanghai 2018',
    })
    .constant('DASHBOARD', {
        UNVERIFIED: '我们已经向你的注册邮箱发送了验证邮件。完成验证后，申请通道将开放\nWe have sent a verification email to your inbox. You will be able to access ',
        INCOMPLETE_TITLE: '你的申请仍未完成\nYou have not yet completed your application',
        INCOMPLETE: '如果你在 [APP_DEADLINE] 前无法完成申请，你将无法被组委会审查参赛资格。请尽快完成你的申请。\nIf you do not complete your application before the [APP_DEADLINE], you will not be considered for admissions!',
        SUBMITTED_TITLE: '你的申请已提交\nYour application has been submitted.',
        SUBMITTED: '我们欢迎你随时修改你的申请。但是，一旦申请结束，你将无法进一步编辑你的申请内容。\n 我们的申请将完全基于你提交的信息，请确保你提交的所有信息真实有效。\nFeel free to edit it at any time. However, once registration is closed, you will not be able to edit it any further.\nAdmissions will be determined by a random lottery. Please make sure your information is accurate before registration is closed!',
        CLOSED_AND_INCOMPLETE_TITLE: '很抱歉，申请已经结束。\n Unfortunately, the application has closed.',
        CLOSED_AND_INCOMPLETE: 'Because you have not completed your profile in time, you will not be eligible for the lottery process.',
        ADMITTED_AND_CAN_CONFIRM_TITLE: '请在 [CONFIRM_DEADLINE] 前确认参赛\nYou must confirm by [CONFIRM_DEADLINE].',
        ADMITTED_AND_CANNOT_CONFIRM_TITLE: '你的参赛邀请已经失效\nYour invitation has been invalidated.',
        ADMITTED_AND_CANNOT_CONFIRM: '虽然我们为你提供了参赛资格，但是你并没有在参赛确认截止日期前确认。\n很遗憾，你将无法参加我们的活动。你的邀请已经提供给了等待名单上的其他申请者。\n希望在明年的活动中见到你！\nAlthough you were accepted, you did not complete your confirmation in time.\nUnfortunately, this means that you will not be able to attend the event, as we must begin to accept other applicants on the waitlist.\nWe hope to see you again next year!',
        CONFIRMED_NOT_PAST_TITLE: '你可以在 [CONFIRM_DEADLINE] 前修改你的确认信息。\nYou can edit your confirmation information until [CONFIRM_DEADLINE].',
        DECLINED: '很遗憾，我们今年无法邀请你参加我们的活动 :(\n希望在明年的活动中见到你！\nWe\'re sorry to hear that you won\'t be able to make it to HackMIT 2015! :(\nMaybe next year! We hope you see you again soon.',
    })
    .constant('TEAM',{
        NO_TEAM_REG_CLOSED: 'Unfortunately, it\'s too late to enter the lottery with a team.\nHowever, you can still form teams on your own before or during the event!',
    });
