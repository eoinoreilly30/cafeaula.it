<template>
  <div
    id="app"
  >
    <v-app>
      <v-main>
        <v-card flat>
          <v-card-title>
            <v-avatar
              size="100%"
            >
              <v-img
                src="@/assets/me.webp"
                max-height="200px"
                max-width="200px"
              />
            </v-avatar>
          </v-card-title>
          <v-card-title class="py-2 justify-center">
            Eoin O'Reilly
          </v-card-title>
          <v-card-text class="py-0 text-center">
            Welcome to my café
          </v-card-text>
          <v-card-text class="py-2 text-center">
            <v-btn
              icon
              href="https://github.com/eoinoreilly30"
            >
              <v-icon color="black">
                mdi-github
              </v-icon>
            </v-btn>
            <v-btn
              icon
              href="https://www.linkedin.com/in/eoin-o-reilly-9a956015b"
            >
              <v-icon color="#0077b5">
                mdi-linkedin
              </v-icon>
            </v-btn>
          </v-card-text>
        </v-card>

        <div class="ma-10">
          <v-row justify="center">
            <v-col
              class="text-center text-h6"
            >
              The Menu
            </v-col>
          </v-row>
          <v-row>
            <v-col
              sm="6"
              md="4"
              lg="2"
            >
              <v-card href="https://chatmaps.art">
                <v-card-title>
                  <v-avatar
                    size="100%"
                  >
                    <v-img
                      src="@/assets/chatmaps.webp"
                    />
                  </v-avatar>
                </v-card-title>
                <v-card-title>
                  ChatMaps
                </v-card-title>
                <v-card-text>
                  A p2p voice-calling app. Explore the map to see who's online and then give them a call
                </v-card-text>
              </v-card>
            </v-col>

            <v-col
              sm="6"
              md="4"
              lg="2"
            >
              <v-card href="/asteroid-dodger/index.html">
                <v-card-title>
                  <v-avatar
                    size="100%"
                    tile
                  >
                    <v-img
                      src="@/assets/asteroid-dodger.webp"
                    />
                  </v-avatar>
                </v-card-title>
                <v-card-title>
                  Asteroid Dodger
                </v-card-title>
                <v-card-text>
                  Use the nav keys or swipe to dodge the glowing yellow asteroids (🔊)
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-main>
    </v-app>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
  background-color: #E8E0DB;
}
</style>
