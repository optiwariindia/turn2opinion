function redeem() {
  fetch('/redeem-popup.html')
    .then((resp) => resp.text())
    .then((data) => {
      popup = document.createElement('div')
      popup.innerHTML = data
      document.body.append(popup)
      document.querySelectorAll('form').forEach((frm) => {
        frm.addEventListener('submit', async (e) => {
          e.preventDefault()
          let inputs = e.currentTarget.querySelectorAll('[name]')
          let data = {}
          await inputs.forEach((elm) => {
            if (elm.validity.valid) data[elm.name] = elm.value
          })
          inp = e.currentTarget.querySelector('[name]:invalid')
          if (inp == null) {
            claim.submit(data)
          }
        })
      })
    })
}
// redeem();
selectForm = async (e) => {
  await e
    .closest('ul')
    .querySelectorAll('label')
    .forEach((e) => {
      e.classList.remove('active')
    })
  e.classList.add('active')
}
dontRedeem = (e) => {
  e.closest('.redeemPopup').remove()
}
const claim = {
  submit: function (e) {
    document
      .querySelector('.redeemPopup')
      .querySelector('.main-body').innerHTML =
      '<div><h2>Thanks for your request</h2><p>Please wait while we are processing your request...</p></div>'
    fetch('/user/redeem', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(e),
    })
      .then((resp) => resp.json())
      .then((data) => {
        document
          .querySelector('.redeemPopup')
          .querySelector(
            '.main-body',
          ).innerHTML = `<div><h2>Thanks for your request</h2><h3>${data.message}</h3></div><div style='align-self:end'><button class='fr btn btn-success' onclick="dontRedeem(this)">Close</button></div>`
      })
    return false
  },
}

const api = {
  endpoint: '/api/v1/',
  get: async function (url) {
    try {
      let response = await fetch(api.endpoint + url)
      let data = await response.json()
      return data
    } catch (error) {
      return { status: 'error', error: error }
    }
  },
  post: async function (url, data) {
    try {
      let response = await fetch(api.endpoint + url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      let data = await response.json()
      return data
    } catch (error) {
      return { status: 'error', error: error }
    }
  },
  put: async function (url, data) {
    try {
      let response = await fetch(api.endpoint + url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      let data = await response.json()
      return data
    } catch (error) {
      return { status: 'error', error: error }
    }
  },
  patch: async function (url, data) {
    try {
      let response = await fetch(api.endpoint + url, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      let data = await response.json()
      return data
    } catch (error) {
      return { status: 'error', error: error }
    }
  },
  delete: async function (url, data) {
    try {
      let response = await fetch(api.endpoint + url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      let data = await response.json()
      return data
    } catch (error) {
      return { status: 'error', error: error }
    }
  },
}

async function read() {
  info = await api.get('userinfo')
  notifications = document.querySelectorAll('[notify]')
  if(notifications.length<4)return ;
  notifications[1].innerText = info.availableSurveys.length
  notifications[2].innerText =
    info.profileCategories.length - info.profiles.length
  notifications[3].innerText = ''
  notifications[0].innerText =
    Number(notifications[1].innerText) +
    Number(notifications[2].innerText) +
    Number(notifications[3].innerText)
  console.log(info)
}
read()

;(() => {
  tablinks = document.querySelectorAll('label.nav-link')
  tablinks.forEach((t) => {
    t.addEventListener('click', (e) => {
      document.querySelector('label.nav-link.active').classList.remove('active')
      t.classList.add('active')
    })
  })
})()
