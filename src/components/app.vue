<template>
<f7-app :params="f7params" id="body" theme-dark>
  <f7-statusbar></f7-statusbar>

  <f7-panel left cover theme-dark>
    <f7-view>
      <f7-page>
        <f7-navbar id="navbar-list" title="Your lists"></f7-navbar>
        <f7-block v-if="noLists" id="no-lists">
          No lists could be found.
          Go create one!
        </f7-block>

        <div v-else id="list-of-lists">
          <f7-block id="number-of-lists" v-if="numberOfLists === 1"> You have <b>{{ numberOfLists }}</b> list. </f7-block>
          <f7-block id="number-of-lists" v-else> You have <b>{{ numberOfLists }}</b> lists. </f7-block>

          <f7-list>
            <f7-list-item v-for="todoList in todoLists" @click="chooseDisplayedList(todoList)" class="list-name" :class="{ checked: todoList.allChecked === true }">
              <span class="checked-items">
                 <b>{{ todoList.listName }}</b>
                 <span class="item-count" :class="{ 'checked-count': todoList.allChecked != true }">
                   {{ todoList.checked.length }}/{{ todoList.listItems.length }}
                 </span>
              </span>
              <f7-icon f7="chevron_right" color="#93a04a" size="30px"></f7-icon>
            </f7-list-item>

            <span class="clear-checked-lists" v-if="checkedListsExist">
              <f7-button v-if="!checkedListsDeleteConfirm" color="red" @click="displayDeleteCheckedListConfirm" class="clear-checked-lists-btn">Clear checked lists</f7-button>
              <f7-button v-else color="red" @click="deleteCheckedLists" class="clear-checked-lists-btn">Are you sure?</f7-button>
            </span>
          </f7-list>

          <br>

          <f7-button v-if="!listsDeleteConfirm" class="clear-lists-btn" color="red" @click="displayDeleteListConfirm">Clear all lists</f7-button>
          <f7-button v-else class="clear-lists-btn" color="red" @click="deleteAllLists">Are you sure?</f7-button>
        </div>
      </f7-page>
    </f7-view>
  </f7-panel>

  <f7-view main>
    <f7-page>

      <f7-navbar :sliding="false" id="navbar">
        <f7-nav-left>
          <f7-link icon-ios="f7:menu" icon-md="material:menu" panel-open="left"></f7-link>
        </f7-nav-left>
        <f7-nav-title id="nav-title" sliding>TODO Lists</f7-nav-title>
      </f7-navbar>

      <f7-toolbar bottom tabbar id="toolbar">
        <f7-link class="bottom-tab" tab-link="#tab1" tab-link-active>
          <f7-icon f7="list_fill" size="30px"></f7-icon>
        </f7-link>
        <f7-link class="bottom-tab" tab-link="#tab2">
          <f7-icon f7="add_round_fill" size="30px"></f7-icon>
        </f7-link>
      </f7-toolbar>

      <div class="tabs-swipeable-wrap">
        <f7-tabs class="tabs">
          <f7-tab id="tab1" class="page-content" tab-active>
            <home-page :createdList="createdList" :selectedList="selectedList" :todoLists="todoLists" @deleted="listDeleted" @checked="itemChecked"></home-page>
          </f7-tab>
          <f7-tab id="tab2" class="page-content">
            <create-todo @created="getTodoList"></create-todo>
          </f7-tab>
        </f7-tabs>
      </div>

    </f7-page>
  </f7-view>

</f7-app>
</template>

<script>
import Home from '../pages/home'
import CreateTodo from '../components/createlist'

export default {
  data() {
    return {
      f7params: {
        name: 'todo',
        theme: 'auto',
        serviceWorker: {
          path: '/service-worker.js',
        },
      },
      noLists: true,
      todoLists: [],
      createdList: {},
      selectedList: {},
      listsDeleteConfirm: false,
      checkedListsDeleteConfirm: false,
      checkedListsExist: false,
    }
  },
  components: {
    'create-todo': CreateTodo,
    'home-page': Home
  },
  methods: {
    getTodoList(todo) {
      this.createdList = {
        listId: todo.id,
        listName: todo.title,
        listItems: todo.todos,
        checked: [],
        allChecked: false
      };

      this.selectedList = this.createdList;
      this.todoLists.push(this.createdList);
      this.noLists = false;
    },
    chooseDisplayedList(todoList) {
      this.selectedList = todoList;
      this.$f7.panel.close();
    },
    listDeleted(listArray) {
      this.todoLists = listArray;

      if (this.todoLists.length == 0) {
        this.noLists = true;
      }
    },
    displayDeleteListConfirm() {
      this.listsDeleteConfirm = true;
    },
    deleteAllLists() {
      this.todoLists = [];
      this.selectedList = {};
      this.noLists = true;
      this.listsDeleteConfirm = false;
    },
    displayDeleteCheckedListConfirm() {
      this.checkedListsDeleteConfirm = true;
    },
    deleteCheckedLists() {
      let newTodoLists = this.todoLists.filter(function(list) {
        return list.allChecked === false;
      });

      if (newTodoLists.length != this.todoLists.length) {
        this.todoLists = newTodoLists;
        this.checkedLists = [];
        this.selectedList = {};
        this.checkedListsExist = false;
        this.checkedListsDeleteConfirm = false;
        if (this.todoLists.length === 0) {
          this.noLists = true;
        }
      } else {
        return false;
      }
    },
    itemChecked(list) {
      this.selectedList.checked = list;
      if (this.selectedList.checked.length === this.selectedList.listItems.length) {
        this.selectedList.allChecked = true;
      } else {
        this.selectedList.allChecked = false;
      }

      let finishedLists = this.todoLists.filter(function(list) {
        return list.allChecked === true;
      });

      if (finishedLists.length != 0) {
        this.checkedListsExist = true;
      } else {
        this.checkedListsExist = false;
      }
    },
  },
  computed: {
    numberOfLists: function() {
      return this.todoLists.length;
    }
  }
}
</script>

<style media="screen">
@import url('https://fonts.googleapis.com/css?family=Overpass|Work+Sans');

#navbar,
#navbar-list,
#nav-title {
  letter-spacing: 0.5px;
  color: #93a04a;
  font-family: 'Work Sans', sans-serif;
  font-size: 25px;
}

#number-of-lists {
  margin: 10px 10px -20px 10px;
}

#no-lists {
  font-size: 18px;
  padding: 0 20px;
  margin-top: 20px;
}

.list-name {
  font-size: 20px;
}

#body {
  font-family: 'Overpass', sans-serif;
  letter-spacing: 0.3px;
}

#toolbar {
  height: 70px;
}

#list-of-lists {
  padding-bottom: 20px;
}

.clear-lists-btn {
  margin: -20px 0 -10px 40% !important;
}

.clear-checked-lists-btn {
  width: 200px;
  margin: 10px 0 -40px 24%;
}

.checked-count {
  color: #93a04a;
}

.checked {
  color: #444 !important;
}

.item-count {
  margin-left: 10px;
}
</style>
