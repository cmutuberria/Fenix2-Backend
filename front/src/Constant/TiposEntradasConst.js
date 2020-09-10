import React from 'react'
import {DirectionsWalk, DirectionsBus,Business, Class, PhotoCamera } from '@material-ui/icons';

export const tiposLabel={
          entradaLibre:"Libre",
          entradaVoucher:"Voucher",
          entradaEmpresa:"Empresa",
          entradaAutorizado:"Autorizado",
          entradaProposito:"Otro Propósito",
      }
export const tiposArray=[
          {_id:"entradaLibre", label:"Libre"},
          {_id:"entradaVoucher", label:"Voucher"},
          {_id:"entradaEmpresa", label:"Empresa"},
          {_id:"entradaAutorizado", label:"Autorizado"},
          {_id:"entradaProposito", label:"Otro Propósito"},
      ];
 export const tiposIcons={
          entradaLibre:<DirectionsWalk />,
          entradaVoucher:<DirectionsBus />,
          entradaEmpresa:<Business />,
          entradaAutorizado:<Class />,
          entradaProposito:<PhotoCamera />,
      }