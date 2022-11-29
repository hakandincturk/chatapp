import React, { useEffect, useState } from 'react'
import { Modal, Form, Button, FormGroup } from 'react-bootstrap'
import useLocalStorage from '../hooks/useLocalStorage';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';

import { getApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth, updatePassword } from "firebase/auth";
import { getDoc, doc, setDoc } from 'firebase/firestore'
import db from '../Helpers/FirebaseHelper'


export default function ProfileModal({ closeModal }) {

  const [email, setEmail] = useLocalStorage('id')
  const [userData, setUserData] = useState()
  const [isImageUploaded, setIsImageUploaded] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageRef, setSelectedImageRef] = useState(null);
  const [name, setName] = useState('')
  const [surname, setSurname] = useState('')
  const [imageURI, setImageURI] = useState('')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordAgain, setNewPasswordAgain] = useState('')
  const [storage, setStorage] = useState()

  // db den verileri cekme
  useEffect(() => {

    const firebaseApp = getApp()
    setStorage(getStorage(firebaseApp))
    

    const fetchUserData = async () => {
      try {
        const docRef = doc(db, "users", email)
        const docSnap = await getDoc(docRef);
        setUserData(docSnap.data());
      } catch (error) {
        console.log('err --> ', error)
      }
    }
    fetchUserData().catch((error) => console.log(error))
  }, [email])

  //db den verileri cektiginde
  useEffect(() => {
    setName(userData?.name)
    setSurname(userData?.surname)
    setCurrentPassword(userData?.password)
    setImageURI(userData?.image)
  }, [userData]);

  const fileUpload = async () => {
    const storageRef = ref(storage, `/profile_photos/${uuidv4()}`);

    try {
      // profil resmini storage'a kaydetmek icin
      await uploadBytes(storageRef, selectedImage)
      const link = await getDownloadURL(storageRef).then((downloadURI) => {
        return downloadURI;
      })
      return link
    } catch (error) {
      toast.error('Resim yuklenirken bir hata meydana geldi.')
      console.log(error.code);
    }
  }


  const formHandle = async (e) => {
    e.preventDefault()

    const auth = getAuth();

    if (newPassword !== newPasswordAgain) {
      toast.error('Şifreler birbiri ile uyuşmalıdır.')
      return;
    }

    let link = null;
    if (selectedImageRef) {
      link = await fileUpload();
    }

    // add new data to collection with custom id
    setDoc(doc(db, 'users', `${email}`), {
      name: name ?? '',
      surname: surname ?? '',
      password: newPassword ?? currentPassword,
      image: isImageUploaded ? link : userData.image
    }, { merge: true }).then(res => {
      updatePassword(auth.currentUser, newPassword ?? currentPassword)
      .then(updatePassResponse => {
        toast.success('Bilgileriniz başarılı bir şekilde güncellendi')
        closeModal(true)
      })
      .catch((error) => {
        if (error.code === 'auth/weak-password') {
          toast.error('Şifre en az 6 karakter olmali.')
        }
        else toast.error(error.code)
        
      })
    }).catch( (error) => {
      toast.error(error.message)
    });
  }

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      setSelectedImage(event.target.files[0])
      setSelectedImageRef(URL.createObjectURL(img))
      setIsImageUploaded(true)
    };

  }

  return (
    <>
      <Modal.Header closeButton>Profil</Modal.Header>
      <Modal.Body>
        <Form onSubmit={formHandle}>

          <FormGroup>
            {(imageURI || selectedImageRef) && (
              <div className='d-flex flex-column rounded align-items-center'>
                <img alt="not fount" className='rounded-circle' width={"250px"} src={imageURI ?? selectedImageRef} />
                <br />
                <button onClick={()=>setSelectedImageRef(null)}>Kaldir</button>
              </div>
            )}
            <Form.Label>Resim</Form.Label>
            <Form.Control type="file" name="myImage" onChange={(event) => { console.log('event --> ', event); onImageChange(event) }}/>
          </FormGroup>
          <FormGroup>
            <Form.Label>Email</Form.Label>
            <Form.Control type="text" value={email} readOnly />
          </FormGroup>
          <FormGroup>
            <Form.Label>Isim</Form.Label>
            <Form.Control type="text" value={name} onChange={e => setName(e.target.value)} />
          </FormGroup>
          <FormGroup>
            <Form.Label>Soyisim</Form.Label>
            <Form.Control type="text" value={surname} onChange={e => setSurname(e.target.value)} />
          </FormGroup>
          <FormGroup>
            <Form.Label>Sifre</Form.Label>
            <Form.Control type="new-password" value={newPassword} onChange={e => setNewPassword(e.target.value)} />
          </FormGroup>
          <FormGroup>
            <Form.Label>Tekrar Sifre</Form.Label>
            <Form.Control type="new-password" value={newPasswordAgain} onChange={e => setNewPasswordAgain(e.target.value)} />
          </FormGroup>
          <Button type="submit">Guncelle</Button>
        </Form>
      </Modal.Body>
    </>
  )
}
