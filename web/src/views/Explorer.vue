<template>
  <div class="drive-select container">
    <!-- drives -->
    <div v-if="!path" style="width:100%;">
      <div @click="setPath(`${drive}/`)" v-for="drive in drives" :key="drive" class="explorer-item">
        <span class="material-icons">storage</span>
        <p>{{drive}}</p>
      </div>
    </div>
    <!-- dir -->
    <div v-if="path && !file" style="width:100%;">
      <div @click="routeClick(item)" v-for="item in dir" :key="item.name" class="explorer-item">
        <span v-if="item.isDir" class="material-icons color-folder">folder</span>
        <span v-else class="material-icons color-file">description</span>
        <p>{{item.name}}</p>
      </div>
    </div>
    <!-- file editor -->
    <textarea class="explorer-editor" v-if="file" v-model="file"></textarea>
    <!-- go back arrow -->
    <button @click="goBack" v-if="path" class="explorer-goBack">
      <span class="material-icons">west</span>
    </button>
  </div>
</template>

<script>
import io from 'socket.io-client'
import path from 'path'
export default {
  name: 'explorer',
  data(){
    return{
      socket:io('ws://localhost:3000'),
      dir:[],
      drives:[],
      path:'',
      file:'',
    }
  },
  created(){
    this.socketEvents()
    this.socket.emit('setAdmin')
    this.socket.emit('getDrives')
  },
  methods:{
      setPath(path){
        this.path = path
        this.socket.emit('getDir',path) 
      },
      goBack(){
        let newPath = path.resolve(`${this.path}/..`)
        newPath = newPath.slice(1,newPath.length)
        this.file = ''
        
        if(!newPath.length){
          return this.path = ''
        }

        if(newPath.length == 2){
          newPath = newPath+'/'
        }
        
        this.setPath(newPath)
      },
      routeClick(item){
        const itemPath = `${this.path}/${item.name}`

        if(item.isDir){
          this.setPath(itemPath)
        }else{
          this.socket.emit('getFile',itemPath)
        }

        this.path = itemPath
      },
      socketEvents(){
        this.socket.on('message',(msg) => {
            console.log(msg)
        })

        this.socket.on('sentDrives',(drives) => {
            this.drives = drives
            this.dir = drives
        })

        this.socket.on('sentDir',(data) => {
            this.dir = data
        })

        this.socket.on('sentFile',(file) => {
            this.file = file
        })
      },
  }
}
</script>
