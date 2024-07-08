<template>
  <div class="login__form">
    <!-- <label for="input-file" class="login__form__label"> -->
      <img v-if="userImage" :src="userImage" class="login__form__avatar" />
      <!-- <div class="login__form__avatar__overlay">
        <img src="../assets/camera.svg" alt="" />
      </div> -->
    <!-- </label> -->
    <!-- <input
      id="input-file"
      type="file"
      @change="uploadImages"
      accept="image/*"
      style="display: none"
    /> -->
    <div class="CardText">
      📝Notes:
<!--     <p>
      1.Remembers what user said earlier in the conversation;
    </p> -->
    <p>
      1.Allows user to provide follow-up corrections. Trained to decline inappropriate requests;
    </p>
    <p>
      2.May occasionally generate incorrect information, produce harmful instructions or biased content.
    </p>
    <p>
      本平台由gpt3.5/4驱动,每天有一定免费资源可用,独立key按所有权限使用
    </p>
    </div>
    <div class="login__form__username">
      <label for="input-username" class="login__form__username__label">
          请输入你的key或任意字符体验.
      </label>
      <!-- <label v-if="errorMsg" class="login__form__username__label">
          Error: {{ errorMsg }}
      </label> -->
      <input
        id="input-username"
        class="login__form__username__input"
        placeholder="key-7788供测试"
        type="text"
        v-model.trim="userName"
        @keyup.enter="joinSubmit"
        required
      />
      <button class="login__button" @click="joinSubmit">login</button>
    </div>
  </div>
</template>

<script>
import Compressor from "compressorjs";
import { mapActions} from "vuex";


export default {
  data() {
    return {
      userImage: new URL(`../assets/op.png`, import.meta.url).href,
      userName: "",
      key: "",
      errorMsg: ""
    };
  },
  created() {
    this.key = JSON.parse(localStorage.getItem('privateKey'));
    if (this.key != "") {
      this.userName = this.key
    }
  },
  methods: {
    ...mapActions(['login']),

    uploadImages(e) {
      const imgFile = e.target.files[0];
      const vueThis = this;

      new Compressor(imgFile, {
        quality: 0.1,
        success(res) {
          const formData = new FormData();
          formData.append("file", res, res.name);

          const reader = new FileReader();
          reader.readAsDataURL(res);

          reader.addEventListener(
            "load",
            () => {
              vueThis.userImage = reader.result;
            },
            false
          );
        },
        error(err) {
          console.log(err.message);
        },
      });
    },

    async joinSubmit() {
      const userData = {
        userImage: this.userImage,
        userName: this.userName,
        key: this.userName
      };

      if (userData.userName) {

        try {
          // this.$store.dispatch("login", userData);
          const response = await this.login(userData);

          // console.log(response.data.data)
          if (response.data && response.data.code == 200) {
            userData.key = response.data.data.key
          } else {
            // this.errorMsg = response.data.errorMsg;
            console.log("error")
          }
          this.$store.commit('setPrivateKey', userData);
          this.$router.push({
                            name: "chat",
                            params: { userData: userData },
                          });

        } catch (error) {
          // Log any errors that occur during the login process
          console.error('Error during login:', error);
          this.errorMsg = error.message || 'Failed to login';
        }
      }
    },
  },
};
</script>

<style>
.login__form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.login__form__label {
  position: relative;
}

.login__form__avatar {
  height: 50px;
  width: 200px;
  /*border-radius: 50%;
  object-fit: cover;*/
}

.login__form__avatar__overlay {
  position: absolute;
  background-color: #000;

  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  opacity: 0;
  height: 60px;
  width: 60px;
  border-radius: 50%;
  transition: 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

/*.login__form__label:hover .login__form__avatar__overlay {
  opacity: 0.2;
}*/

.CardText {
  border-radius: 12px;
  background: #fff;
  padding: 20px;
  color: #333;
}

.login__form__username {
  margin-top: 1rem;
}

.login__form__username__label {
  display: block;
  text-align: center;
  font-weight: 700;
  color: #727271;
}

.login__form__username__input {
  width: 8rem;
  margin-top: 2rem;
  padding: 0.4rem;
  border: none;
  border-bottom: 1.5px solid #afb4b8;
  text-align: center;
  font-size: 15px;
}

.login__form__username__input:focus {
  outline: none;
}

.login__button {
  background-color: #2a932e;
  border: none;
  color: white;
  /*padding: 15px 32px;*/
  text-align: center;
  text-decoration: none;
  display: inline-block;
  border-radius: 5px;
  margin-left: 15px;
  /*font-size: 16px;*/
}
</style>
