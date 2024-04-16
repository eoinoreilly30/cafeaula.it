<template>
  <div class="bg-slate-50">
    <UContainer>
      <div class="flex flex-col items-center py-10">
        <div class="flex flex-row items-center space-x-4">
          <NuxtImg
            src="/me.jpeg"
            width="80px"
            height="80px"
            alt="me"
            class="rounded-3xl"
          />
          <div>
            <div>Hi, I'm Eoin.</div>
            <div class="text-pretty">A software developer from Ireland.</div>
          </div>
        </div>

        <UDivider class="my-10 sm:w-1/2 w-10/12" />

        <div class="flex flex-col space-y-6 md:w-1/2 sm:w-2/3 w-full">
          <NuxtLink href="https://clientsai.app/" target="_blank">
            <UCard>
              <div class="flex flex-row items-center space-x-4">
                <NuxtImg
                  src="/clientsai.png"
                  width="60px"
                  height="60px"
                  alt="chatmaps icon"
                />
                <div class="flex flex-col justify-center">
                  <div class="flex flex-row items-center space-x-2">
                    <div class="text-lg font-semibold">ClientsAI</div>
                    <UBadge color="primary" variant="soft">2024</UBadge>
                  </div>
                  <div>
                    All your conversations in one manageable place. Connect your
                    emails, video calls and messages.
                  </div>
                </div>
              </div>
            </UCard>
          </NuxtLink>

          <NuxtLink href="https://getsaasideas.com" target="_blank">
            <UCard>
              <div class="flex flex-row items-center space-x-4">
                <NuxtImg
                  src="/getsaasideas.png"
                  width="60px"
                  height="60px"
                  alt="chatmaps icon"
                />
                <div class="flex flex-col justify-center">
                  <div class="flex flex-row items-center space-x-2">
                    <div class="text-lg font-semibold">Get SaaS Ideas</div>
                    <UBadge color="primary" variant="soft">2024</UBadge>
                  </div>
                  <div>Find your next SaaS idea in hours, not weeks</div>
                </div>
              </div>
            </UCard>
          </NuxtLink>

          <NuxtLink href="https://chatmaps-75d1d.web.app/" target="_blank">
            <UCard>
              <div class="flex flex-row items-center space-x-4">
                <NuxtImg
                  src="/chatmaps.png"
                  width="60px"
                  height="60px"
                  alt="chatmaps icon"
                />
                <div class="flex flex-col justify-center">
                  <div class="flex flex-row items-center space-x-2">
                    <div class="text-lg font-semibold">Chat Maps</div>
                    <UBadge color="primary" variant="soft">2022</UBadge>
                  </div>
                  <div>
                    A peer to peer voice calling app. Scroll around the map to
                    see who's online
                  </div>
                </div>
              </div>
            </UCard>
          </NuxtLink>

          <NuxtLink href="https://paint-eab6a.web.app/" target="_blank">
            <UCard>
              <div class="flex flex-row items-center space-x-4">
                <NuxtImg
                  src="/paint.png"
                  width="60px"
                  height="60px"
                  alt="paint icon"
                />
                <div class="flex flex-col justify-center">
                  <div class="flex flex-row items-center space-x-2">
                    <div class="text-lg font-semibold">Paint</div>
                    <UBadge color="primary" variant="soft">2022</UBadge>
                  </div>
                  <div>A realtime drawing canvas using websockets.</div>
                </div>
              </div>
            </UCard>
          </NuxtLink>

          <NuxtLink
            href="https://asteroid-dodger-cf30b.web.app/"
            target="_blank"
          >
            <UCard>
              <div class="flex flex-row items-center space-x-4">
                <NuxtImg
                  src="/asteroid_dodger.png"
                  width="60px"
                  height="60px"
                  alt="asteroid dodger icon"
                />
                <div class="flex flex-col justify-center">
                  <div class="flex flex-row items-center space-x-2">
                    <div class="text-lg font-semibold">Asteroid Dodger</div>
                    <UBadge color="primary" variant="soft">2020</UBadge>
                  </div>
                  <div>
                    OSG.js browser game. Dodge the glowing yellow asteroids
                  </div>
                </div>
              </div>
            </UCard>
          </NuxtLink>
        </div>

        <UDivider class="my-10 sm:w-1/2 w-10/12" />

        <div class="flex flex-row space-x-6">
          <NuxtLink href="https://github.com/eoinoreilly30" target="_blank">
            <div class="flex flex-row items-center space-x-1">
              <NuxtImg
                src="/github.png"
                width="25px"
                height="25px"
                alt="github icon"
              />
              <div>GitHub</div>
            </div>
          </NuxtLink>

          <NuxtLink href="https://twitter.com/3oino" target="_blank">
            <div class="flex flex-row items-center space-x-1">
              <NuxtImg
                src="/twitter.png"
                width="25px"
                height="25px"
                alt="twitter icon"
              />
              <div>Twitter</div>
            </div>
          </NuxtLink>

          <NuxtLink
            href="https://www.linkedin.com/in/eoin-o-reilly-9a956015b/"
            target="_blank"
          >
            <div class="flex flex-row items-center space-x-1">
              <NuxtImg
                src="/linkedin.png"
                width="18px"
                height="18px"
                alt="linkedin icon"
              />
              <div>LinkedIn</div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({
  title: useRuntimeConfig().public.appName,
  description: useRuntimeConfig().public.ogDescription,
  ogTitle: useRuntimeConfig().public.ogTitle,
  ogDescription: useRuntimeConfig().public.ogDescription,
  ogImage: `${useRuntimeConfig().public.appURL}/opengraph.png`,
  ogUrl: useRuntimeConfig().public.appURL,
  twitterCard: "summary",
  twitterTitle: useRuntimeConfig().public.ogTitle,
  twitterDescription: useRuntimeConfig().public.ogDescription,
  twitterImage: `${useRuntimeConfig().public.appURL}/opengraph.png`,
});
</script>
