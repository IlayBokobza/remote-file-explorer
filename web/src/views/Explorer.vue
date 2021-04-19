<template>
  <div>
    <!-- container -->
    <div class="drive-select container">
      <!-- drives -->
      <div v-if="!path" style="width:100%;">
        <div @click="setPath(`${drive}/`)" v-for="drive in drives" :key="drive" class="explorer-item">
          <span class="material-icons">storage</span>
          <p>{{drive}}</p>
        </div>
      </div>
      <!-- dir -->
      <div v-if="path && !file && dir.length > 0" style="width:100%;">
        <div @click="routeClick(item)" v-for="item in dir" :key="item.name" class="explorer-item">
          <span v-if="item.isDir" class="material-icons color-folder">folder</span>
          <span v-else-if="checkFileType(['png','jpg','jpeg'],item.name)" class="material-icons color-image">image</span>
          <span v-else class="material-icons color-file">description</span>
          <p>{{item.name}}</p>
        </div>
      </div>
      <p class="title" v-else-if="dir.length === 0">No files in directory</p>
      <!-- image display -->
      <img :src="'data:image/png;base64, '+file" v-if="file && checkFileType(['png','jpg','jpeg'],path)">
      <!-- file editor -->
      <textarea class="explorer-editor" v-else-if="file" v-model="file"></textarea>
    </div>
    <!-- controls -->
    <div class="explorer-controls">
      <button @click="goBack" v-if="path">
        <span class="material-icons">west</span>
      </button>
      <button @click="refresh($event)">
        <span class="material-icons">autorenew</span>
      </button>
      <button v-if="file" @click="downloadFile">
        <span class="material-icons">download</span>
      </button>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client'
import path from 'path'
export default {
  name: 'explorer',
  data(){
    return{
      socket:io(),
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
      downloadFile(){
        const fileName = this.path.replace(/^.*[\\/]/, '')
        let fileData = null

        if(this.checkFileType(['png','jpg','jpeg'],fileName)){
          fileData = this.file
        }else{
          fileData = btoa(this.file)
        }

        const simDownloadBtn = document.getElementById('sim-download-btn')
        simDownloadBtn.setAttribute('href',`data:application/octet-stream;base64, ${fileData}`)
        simDownloadBtn.setAttribute('download',fileName)
        simDownloadBtn.click()
      },
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
      sortDir(dir = []){
        const output = []

        //gets folders
        dir.forEach(item => {
          if(item.isDir){
            output.push(item)
          }
        })

        //gets files
        dir.forEach(item => {
          if(!item.isDir){
            output.push(item)
          }
        })

        return output
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
            this.dir = this.sortDir(data)
            // this.dir = data
        })

        this.socket.on('sentFile',(file) => {
            this.file = file
        })
      },
      checkFileType(extensions = [],fileName){
          let startPartten = '.('
          let endPartten = ')$'

          extensions.forEach((extension,index) => {
              startPartten += extension

              if(index !== extensions.length-1){
                  startPartten += '|'
              }
          })

          const parrten = startPartten + endPartten
          const regex = new RegExp(parrten,'i')

          return regex.test(fileName)
      },
      refresh(e){
        //refreshes
        if(this.path){
          this.setPath(this.path)
        }else{
          this.socket.emit('getDrives')
        }
        //animates btn
        const ref = e.target
        ref.classList.add('spin')
        setTimeout(() => {ref.classList.remove('spin')},200)
      }
  },
}
</script>
