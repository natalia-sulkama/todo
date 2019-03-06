<template>
<div class="home-page">
  <f7-block v-if="noListExists">
    <h2>No list selected</h2>
    <p>Choose a list from the panel on the left, or create a new one.</p>
    <f7-link tab-link="#tab2" tab-link-active>
      <f7-button raised fill round id="list-creation-btn">
        Go to list creation
      </f7-button>
    </f7-link>
  </f7-block>

  <f7-block v-else>
    <h2 id="list-title"> {{ activeList.listName }} </h2>
    <f7-button v-if="!deleteConfirm" id="list-delete-btn" color="red" @click="displayDeleteConfirm">Delete list</f7-button>
    <f7-button v-else id="list-delete-btn" color="red" @click="deleteList(activeList)">Are you sure?</f7-button>

    <f7-list id="todo-preview" v-if="!noListItems">
      <f7-list-item v-for="(uncheckedItem, index) in uncheckedItems" class="todo-item">
        <i class="far fa-square" @click="checkTaskDone(uncheckedItem)"></i>
        <span class="item-title">{{ uncheckedItem.item }}</span>
        <span @click="removeTask(uncheckedItem)">
          <f7-icon f7="close" size="25px" color="red"></f7-icon>
        </span>
      </f7-list-item>
      <f7-list-item v-for="(checkedItem, index) in checkedItems" class="checked todo-item">
        <i class="fas fa-check-square" @click="checkTaskDone(checkedItem)"></i>
        <span class="item-title">{{ checkedItem.item }}</span>
        <span @click="removeTask(checkedItem)">
          <f7-icon f7="close" size="25px" color="red"></f7-icon>
        </span>
      </f7-list-item>
    </f7-list>
    <f7-list id="todo-preview" v-else>
      <p>There are no items in this list.</p>
    </f7-list>
  </f7-block>
</div>
</template>

<script>
export default {
  data() {
    return {
      noListExists: true,
      listArray: [],
      activeList: {},
      done: false,
      checkedItemsExist: false,
      noListItems: false,
      deleteConfirm: false,
    }
  },
  props: ['createdList', 'selectedList', 'todoLists'],
  watch: {
    createdList: function(newVal, oldVal) {
      this.activeList = this.createdList;
      this.displayList();
    },
    selectedList: function(newVal, oldVal) {
      if (Object.entries(newVal).length === 0 && newVal.constructor === Object) {
        this.noListExists = true;
      } else {
        this.activeList = this.selectedList;
        this.displayList();
      }
    },
    todoLists: function(newVal, oldVal) {
      if (Object.entries(newVal).length === 0 && newVal.constructor === Object) {
        this.noListExists = true;
      } else {
        this.listArray = this.todoLists;
      }
    }
  },
  methods: {
    displayList() {
      if (this.activeList === undefined || this.activeList == '') {
        this.noListExists = true;
      } else {
        this.noListExists = false;
        if (this.activeList.listItems.length == 0) {
          this.noListItems = true;
        } else {
          this.noListItems = false;
        }
      }
    },
    checkTaskDone(item) {
      item.done = !item.done;
      this.checkForCheckedItems();
    },
    checkForCheckedItems() {
      this.$emit('checked', this.checkedItems);
      if (this.checkedItems === undefined || this.checkedItems.length == 0) {
        this.checkedItemsExist = true;
      } else {
        this.checkedItemsExist = false;
      }
    },
    removeTask(item) {
      let vm = this;
      let itemIndex = vm.activeList.listItems.indexOf(item);
      vm.activeList.listItems.forEach(function(itemToDelete) {
        if (item.item == itemToDelete.item) {
          let index = vm.activeList.listItems.indexOf(itemToDelete);
          if (index === itemIndex && index !== -1 && itemIndex !== -1) {
            vm.activeList.listItems.splice(index, 1);
          }
        }
      });

      if (vm.activeList.listItems.length == 0) {
        vm.noListItems = true;
      }
    },
    displayDeleteConfirm() {
      this.deleteConfirm = true;
    },
    deleteList(list) {
      let deletedList = this.listArray.indexOf(list);
      this.listArray.splice(deletedList, 1);
      this.noListExists = true;
      this.deleteConfirm = false;
      this.$emit('deleted', this.listArray);
      this.activeList = '';
    }
  },
  computed: {
    uncheckedItems: function() {
      return this.activeList.listItems.filter(function(item) {
        return !item.done;
      })
    },
    checkedItems: function() {
      return this.activeList.listItems.filter(function(item) {
        return item.done;
      })
    },
  }
}
</script>

<style media="screen" scoped>
.home-page {
  margin: -60px 20px 0 20px;
}

#list-creation-btn {
  padding: 10px 25px;
  height: 50px;
  margin-top: 5px;
  font-weight: 600;
  letter-spacing: 1px;
  font-size: 18px;
}

h2 {
  font-size: 30px;
  margin-bottom: -5px;
}

p {
  font-size: 20px;
}

.checked {
  color: #444;
}

#list-delete-btn {
  max-width: 160px;
  margin-top: -5px;
  margin-bottom: -15px;
  font-size: 18px;
}

.todo-item {
  font-size: 18px;
}

.fa-check-square,
.fa-square {
  font-size: 25px;
}

.item-title {
  position: absolute;
  left: 35px;
}
</style>
