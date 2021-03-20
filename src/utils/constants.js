export const CONTEST_STATUS_REVERSE = {
  '-1': {
    name: '未开始',
    color: '#f90'
  },
  '0': {
    name: '进行中',
    color: '#19be6b'
  },
  '1': {
    name: '已结束',
    color: '#ed3f14'
  }
}

export const CONTEST_AUTH_REVERSE = {
  '0': {
    name: '公开',
    color: 'success',
    tips: '公开赛，每个用户都可查看与提交',
    submit: true, // 公开赛可看可提交
    look: true
  },
  '1': {
    name: '私有',
    color: 'danger',
    tips: '私有赛，需要密码才可查看与提交',
    submit: false, // 私有赛 必须要密码才能看和提交
    look: false
  }
}

export const CONTEST_TYPE_REVERSE = {
  '0': {
    name: '普通比赛',
    tips: '所有用户都可参加，不计Rating分数'
  },
  '1': {
    name: 'Rating比赛',
    tips: '所有用户都可参加，计Rating分数'
  }
}
