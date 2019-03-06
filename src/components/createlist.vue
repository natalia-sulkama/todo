<template>
<f7-block class="todo">
  <h2>Create a new list</h2>
  <f7-list id="todo-form" form>
    <f7-list-input id="title-input" type="text" name="listname" placeholder="Today's tasks" required validate error-message="Your list needs a name!" clear-button inputStyle="font-size: 25px;" v-on:input="checkFormValidity" label="Name of your list"></f7-list-input>

    <f7-list-input id="item-input" type="text" name="listitem" placeholder="e.g. Buy milk, read a book, wash dishes..." inputStyle="font-size: 18px;" v-on:input="checkFormValidity" label="What needs to be done?"></f7-list-input>
    <f7-button id="add-task-btn" @click="newItem">
      <f7-icon f7="add" id="addicon" size="25px"></f7-icon> Add task
    </f7-button>
  </f7-list>

  <f7-row v-if="titleExists || listItems.length != 0" id="list-preview-row">
    <f7-col id="list-preview-col">
      <h2>List preview</h2>
    </f7-col>
    <f7-col id="create-list-col">
      <f7-button id="create-list-btn" fill @click="createList" :disabled="disabled == 1 ? true : false">
        <f7-icon f7="check" size="20px" color="green"></f7-icon> Create list
      </f7-button>
    </f7-col>
  </f7-row>

  <h2 id="list-title-preview" v-if="titleExists"> {{ listName }} </h2>
  <f7-list id="todo-preview">
    <f7-list-item id="list-item-preview" v-for="(listItem, index) in listItems">
      {{ index+1 }}. {{ listItem.item }}
      <span @click="removeTodo(index)">
        <f7-icon f7="close" size="25px" color="red"></f7-icon>
      </span>
    </f7-list-item>
  </f7-list>
</f7-block>
</template>

<script>
export default {
  data() {
    return {
      disabled: 1,
      tabLinkDisabled: true,
      listId: 0,
      listName: '',
      listItems: [],
      singleListItem: {},
      listItemName: '',
      done: false,
      titleExists: false,
      createdList: {},
    }
  },
  methods: {
    newItem() {
      let formData = this.$f7.form.convertToData('#todo-form');
      this.listItemName = formData.listitem;
      if (this.listItemName === '' || this.listItemName === undefined) {
        return false;
        this.disabled = 1;
        this.tabLinkDisabled = true;
      } else {
        this.singleListItem = {
          item: this.listItemName,
          done: this.done
        }

        this.listItems.push(this.singleListItem);
        if (formData.listname != '') {
          this.disabled = 0;
          this.tabLinkDisabled = false;
        }

        this.$$('input.input-with-value').forEach(function(input) {
          if (input.name === 'listitem') {
            input.value = '';
          }
        });
      }
    },
    removeTodo(selectedItem) {
      this.listItems.splice(selectedItem, 1);
      if (this.listItems.length <= 0) {
        this.disabled = 1;
        this.tabLinkDisabled = true;
      }
    },
    createList() {
      if (this.disabled === 1 || this.tabLinkDisabled === true) {
        return false;
      }

      let formData = this.$f7.form.convertToData('#todo-form');
      if (formData.listname != '' && this.listItems != '') {
        this.listId++;
        this.createdList = {
          id: this.listId,
          title: formData.listname,
          todos: this.listItems
        };
        this.$emit('created', this.createdList);
        this.$$('input.input-with-value').forEach(function(input) {
          input.value = '';
        });
        this.checkFormValidity();
        this.listItems = [];
        this.$f7.tab.show(tab1, true);
      } else {
        return false;
      }
    },
    checkFormValidity() {
      let formData = this.$f7.form.convertToData('#todo-form');
      this.listName = formData.listname;

      if (formData.listname === '') {
        this.titleExists = false;
      } else {
        this.titleExists = true;
      }

      if (formData.listname === '' || formData.listname === undefined || this.listItems.length == 0) {
        this.disabled = 1;
        this.tabLinkDisabled = true;
      } else {
        this.disabled = 0;
        this.tabLinkDisabled = false;
      }
    }
  }
}
</script>

<style media="screen" scoped>
.todo {
  margin: -30px 10px 0 10px;
}

h2 {
  margin-bottom: -20px;
  letter-spacing: 1px;
  font-size: 20px;
  padding-left: 20px;
  color: #93a04a;
}

#title-input {
  padding-top: 5px;
}

#item-input {
  padding-bottom: 35px;
}

#addicon {
  margin-top: -5px;
  margin-right: -5px;
}

#add-task-btn {
  max-width: 150px;
  margin-top: -40px;
  font-size: 18px;
  position: absolute;
  right: 10px;
}

#list-title-preview {
  padding: 20px 0 10px 10px;
  font-size: 18px;
  color: #fff;
}

#create-list-btn {
  max-width: 160px;
  font-weight: 600;
  padding: 0 15px;
  letter-spacing: 1px;
  font-size: 18px;
  text-transform: capitalize;
  margin-top: -20px;
  margin-left: 12%;
}

.remove-item-btn {
  color: #93a04a;
  font-size: 30px;
  margin-right: -5px;
  margin-left: 10px;
}

#todo-preview {
  padding-top: 5px;
}

#list-preview-row {
  padding-top: 20px;
  margin-bottom: -25px;
}

#list-preview-col {
  margin-top: -40px;
}
</style>
