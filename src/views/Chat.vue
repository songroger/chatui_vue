<template>
  <div class="chat">
    <div class="chat__header">
    <a href=""> 
      <span class="chat__header__greetings">
        🍋Chatbot
      </span>
    </a>
      <span class="chat__header__menu">
        ...
      </span>
    </div>
    <chat-list :msgs="msgData"></chat-list>
    <chat-form @submitMessage="sendMessage"></chat-form>
  </div>
</template>

<script>
import { mapMutations, mapActions, mapState } from "vuex";
import ChatList from "@/components/ChatList.vue";
import ChatForm from "@/components/ChatForm.vue";
import Constant from "@/Constant";

export default {
  data() {
    return {
      userData: null,
      key: null,
    };
  },
  components: {
    ChatList,
    ChatForm,
  },
  computed: {
    ...mapState({
      msgData: (state) => state.socket.msgData,
      requestData: (state) => null,
    }),
  },
  created() {
    this.userData = this.$route.params.userData;
    this.key = JSON.parse(localStorage.getItem('privateKey'));
    // console.log(this.userData.userName)
  },

  mounted() {

    //   setTimeout(() => {
    //     const element = document.getElementById("chat__body");
    //     element.scrollTop = element.scrollHeight;
    //   }, 0);
    // });
  },

  methods: {
    ...mapActions(['sendPostRequest']),
    ...mapMutations({
      pushMsgData: Constant.PUSH_MSG_DATA,
    }),

    async sendMessage(msg) {
      try {
        this.pushMsgData({
                    from: {
                      name: "DevplaCalledMe",
                      avatar: "/assets/user.png",
                    },
                    msg,
                  });
        const response = await this.sendPostRequest({
                  messages: [{
                            "role": "user",
                            "content": msg
                            }],
                  model: this.key
                          });
        if (response.data.code == 0) {
          this.$store.commit('setRequestData', response.data.data.messages);
          // console.log(this.$store.state.requestData)
          this.pushMsgData({
                      from: {
                        name: "",
                        avatar: "/assets/gpt.png",
                      },
                      msg: response.data.data.reply,
                    });
          // console.log(this.$store.state.msgData)
        }
        console.log(response.data.errorMsg)
      } catch (error) {
        console.log(error);
      }

    // sendMessage(msg) {
    //   const username = this.userData.userName;
    //   const avatar = this.userData.userImage;

    //   this.pushMsgData({
    //     from: {
    //       name: "DevplaCalledMe",
    //       avatar: avatar,
    //     },
    //     msg,
    //   });

    //   this.$sendMessage({
    //     name: username,
    //     msg,
    //     avatar: avatar,
    //   });

      setTimeout(() => {
        const element = document.getElementById("chat__body");
        element.scrollTop = element.scrollHeight;
      }, 0);
    },
  },
};
</script>

<style scoped>
.chat {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.chat__header {
  background: #ffffff;
  box-shadow: 0px 3px 10px rgba(0, 0, 0, 0.05);
  border-radius: 24px 24px 0px 0px;
  padding: 1.8rem;
  font-size: 16px;
  font-weight: 700;
}

.chat__header a {
  text-decoration: none;
}

.chat__header__greetings {
  color: #292929;
}
.chat__header__menu {
  color: #292929;
  float: right;
  font-weight: 700;
}
</style>
