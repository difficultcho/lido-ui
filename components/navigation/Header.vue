<template>
    <div class="text-center d-flex align-center justify-center mr-5 header__profile">
        <v-menu :location="'bottom'">
            <template v-slot:activator="{ props }">
                <v-btn
                    variant="text"
                    color="white"
                    class="text-none"
                    dark
                    v-bind="props"
                >
                    <v-avatar color="surface-variant" size="32"></v-avatar>
                    <span class="ml-2 mr-1">Oleh</span>
                    <v-icon size="x-small" icon="fas fa-chevron-down" class="ml-2" />
                </v-btn>
            </template>
            <v-list>
                <v-list-item
                    v-for="(item, index) in items"
                    :key="index"
                >
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
    </div>
</template>
<script>
  export default {
    data: () => ({
      items: [
        { title: 'Click Me' },
        { title: 'Click Me' },
        { title: 'Click Me' },
        { title: 'Click Me 2' },
      ]
    }),
  }
</script>