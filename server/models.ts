import mongoose, { Schema, Document } from 'mongoose';

// --- GEOGRAPHY ---

export interface IRegion extends Document {
  id: number;
  NOMBRE_REGION: string;
}

const RegionSchema = new Schema<IRegion>({
  id: { type: Number, required: true, unique: true },
  NOMBRE_REGION: { type: String, required: true }
});

export interface IComuna extends Document {
  id: number;
  ID_REGION: number;
  NOMBRE_COMUNA: string;
}

const ComunaSchema = new Schema<IComuna>({
  id: { type: Number, required: true, unique: true },
  ID_REGION: { type: Number, required: true, ref: 'Region' },
  NOMBRE_COMUNA: { type: String, required: true }
});

export interface IDireccion extends Document {
  id: number;
  CALLE: string;
  ID_COMUNA: number;
}

const DireccionSchema = new Schema<IDireccion>({
  id: { type: Number, required: true, unique: true },
  CALLE: { type: String, required: true },
  ID_COMUNA: { type: Number, required: true, ref: 'Comuna' }
});

// --- AUTH / USER ---

export interface IUsuario extends Document {
  id: number;
  ID_DIRECCION?: number | null;
  NOMBRE_USUARIO: string;
  NOMBRE_COMPLETO: string;
  CORREO: string;
  CONTRASENA: string;
  TELEFONO?: string;
  BIOGRAFIA?: string;
  DIRECCION_TEXTO?: string;
  FECHA_REGISTRO: Date;
  ES_ADMIN: boolean;
}

const UsuarioSchema = new Schema<IUsuario>({
  id: { type: Number, required: true, unique: true },
  ID_DIRECCION: { type: Number, ref: 'Direccion', default: null },
  NOMBRE_USUARIO: { type: String, required: true, unique: true },
  NOMBRE_COMPLETO: { type: String, required: true },
  CORREO: { type: String, required: true, unique: true },
  CONTRASENA: { type: String, required: true },
  TELEFONO: { type: String },
  BIOGRAFIA: { type: String },
  DIRECCION_TEXTO: { type: String },
  FECHA_REGISTRO: { type: Date, default: Date.now },
  ES_ADMIN: { type: Boolean, default: false }
});

// --- CATALOG ---

export interface ICategoria extends Document {
  id: number;
  NOMBRE_CATEGORIA: string;
  DESCRIPCION?: string;
}

const CategoriaSchema = new Schema<ICategoria>({
  id: { type: Number, required: true, unique: true },
  NOMBRE_CATEGORIA: { type: String, required: true },
  DESCRIPCION: { type: String }
});

export interface IPrenda extends Document {
  id: number;
  NOMBRE_PRENDA: string;
  ID_USUARIO_VENDEDOR: number;
  ID_CATEGORIA: number;
  FECHA_PUBLICACION: Date;
  DESCRIPCION?: string;
  ESTADO_VENTA: string;
  TALLA?: string;
  PRECIO_VENTA_PUBLICO: number;
  ESTADO_CONSERVACION?: string;
  // Extra fields from JSON to support frontend expectations
  OLD_PRICE?: number;
  DISCOUNT?: string;
  RATING?: number;
  REVIEWS_COUNT?: number;
  FREE_SHIPPING?: boolean;
}

const PrendaSchema = new Schema<IPrenda>({
  id: { type: Number, required: true, unique: true },
  NOMBRE_PRENDA: { type: String, required: true },
  ID_USUARIO_VENDEDOR: { type: Number, required: true, ref: 'Usuario' },
  ID_CATEGORIA: { type: Number, required: true, ref: 'Categoria' },
  FECHA_PUBLICACION: { type: Date, default: Date.now },
  DESCRIPCION: { type: String },
  ESTADO_VENTA: { type: String, default: 'Disponible' },
  TALLA: { type: String },
  PRECIO_VENTA_PUBLICO: { type: Number, required: true },
  ESTADO_CONSERVACION: { type: String },
  OLD_PRICE: { type: Number },
  DISCOUNT: { type: String },
  RATING: { type: Number },
  REVIEWS_COUNT: { type: Number },
  FREE_SHIPPING: { type: Boolean, default: false }
});

export interface IPrendaImagen extends Document {
  id: number;
  ID_PRENDA: number;
  URL: string;
}

const PrendaImagenSchema = new Schema<IPrendaImagen>({
  id: { type: Number, required: true, unique: true },
  ID_PRENDA: { type: Number, required: true, ref: 'Prenda' },
  URL: { type: String, required: true }
});

// --- CART ---

export interface ICarrito extends Document {
  id: number;
  ID_USUARIO: number;
  FECHA_CREACION: Date;
}

const CarritoSchema = new Schema<ICarrito>({
  id: { type: Number, required: true, unique: true },
  ID_USUARIO: { type: Number, required: true, ref: 'Usuario' },
  FECHA_CREACION: { type: Date, default: Date.now }
});

export interface ICarritoItem extends Document {
  id: number;
  ID_CARRITO: number;
  ID_PRENDA: number;
  CANTIDAD: number;
}

const CarritoItemSchema = new Schema<ICarritoItem>({
  id: { type: Number, required: true, unique: true },
  ID_CARRITO: { type: Number, required: true, ref: 'Carrito' },
  ID_PRENDA: { type: Number, required: true, ref: 'Prenda' },
  CANTIDAD: { type: Number, required: true, min: 1 }
});

// --- ORDERS ---

export interface IOrden extends Document {
  id: number;
  ID_USUARIO_COMPRADOR: number;
  FECHA_COMPRA: Date;
  MONTO_TOTAL: number;
  ESTADO_ENVIO: string;
}

const OrdenSchema = new Schema<IOrden>({
  id: { type: Number, required: true, unique: true },
  ID_USUARIO_COMPRADOR: { type: Number, required: true, ref: 'Usuario' },
  FECHA_COMPRA: { type: Date, default: Date.now },
  MONTO_TOTAL: { type: Number, required: true },
  ESTADO_ENVIO: { type: String, default: 'Pendiente' }
});

export interface IDetalleOrden extends Document {
  ID_ORDEN: number;
  ID_PRENDA: number;
  CANTIDAD: number;
  PRECIO_UNITARIO: number;
}

const DetalleOrdenSchema = new Schema<IDetalleOrden>({
  ID_ORDEN: { type: Number, required: true, ref: 'Orden' },
  ID_PRENDA: { type: Number, required: true, ref: 'Prenda' },
  CANTIDAD: { type: Number, required: true, min: 1 },
  PRECIO_UNITARIO: { type: Number, required: true }
});

export interface IPago extends Document {
  id: number;
  ID_ORDEN: number;
  METODO: string;
  ESTADO: string;
  FECHA: Date;
}

const PagoSchema = new Schema<IPago>({
  id: { type: Number, required: true, unique: true },
  ID_ORDEN: { type: Number, required: true, unique: true, ref: 'Orden' },
  METODO: { type: String, required: true },
  ESTADO: { type: String, required: true },
  FECHA: { type: Date, default: Date.now }
});

export interface IEnvio extends Document {
  id: number;
  ID_ORDEN: number;
  ID_DIRECCION: number;
  TRACKING?: string;
  ESTADO: string;
}

const EnvioSchema = new Schema<IEnvio>({
  id: { type: Number, required: true, unique: true },
  ID_ORDEN: { type: Number, required: true, unique: true, ref: 'Orden' },
  ID_DIRECCION: { type: Number, required: true, ref: 'Direccion' },
  TRACKING: { type: String },
  ESTADO: { type: String, required: true }
});

// --- SOCIAL / FEATURES ---

export interface ICalificacion extends Document {
  id: number;
  ID_ORDEN: number;
  ID_USUARIO_VENDEDOR: number;
  ID_USUARIO_COMPRADOR: number;
  FECHA_CALIFICACION: Date;
  CALIFICACION: number;
  COMENTARIO?: string;
}

const CalificacionSchema = new Schema<ICalificacion>({
  id: { type: Number, required: true, unique: true },
  ID_ORDEN: { type: Number, required: true, unique: true, ref: 'Orden' },
  ID_USUARIO_VENDEDOR: { type: Number, required: true, ref: 'Usuario' },
  ID_USUARIO_COMPRADOR: { type: Number, required: true, ref: 'Usuario' },
  FECHA_CALIFICACION: { type: Date, default: Date.now },
  CALIFICACION: { type: Number, required: true, min: 1, max: 5 },
  COMENTARIO: { type: String }
});

export interface IFavorito extends Document {
  ID_USUARIO: number;
  ID_PRENDA: number;
}

const FavoritoSchema = new Schema<IFavorito>({
  ID_USUARIO: { type: Number, required: true, ref: 'Usuario' },
  ID_PRENDA: { type: Number, required: true, ref: 'Prenda' }
});

// --- HERO SLIDE (Integration requested) ---

export interface IHeroSlide extends Document {
  id: number;
  title: string;
  subtitle: string;
  buttonText: string;
  image: string;
  link: string;
}

const HeroSlideSchema = new Schema<IHeroSlide>({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  buttonText: { type: String, required: true },
  image: { type: String, required: true },
  link: { type: String, default: '/search' }
});

// --- MODELS EXPORT ---

export const Region = mongoose.model<IRegion>('Region', RegionSchema);
export const Comuna = mongoose.model<IComuna>('Comuna', ComunaSchema);
export const Direccion = mongoose.model<IDireccion>('Direccion', DireccionSchema);
export const Usuario = mongoose.model<IUsuario>('Usuario', UsuarioSchema);
export const Categoria = mongoose.model<ICategoria>('Categoria', CategoriaSchema);
export const Prenda = mongoose.model<IPrenda>('Prenda', PrendaSchema);
export const PrendaImagen = mongoose.model<IPrendaImagen>('PrendaImagen', PrendaImagenSchema);
export const Carrito = mongoose.model<ICarrito>('Carrito', CarritoSchema);
export const CarritoItem = mongoose.model<ICarritoItem>('CarritoItem', CarritoItemSchema);
export const Orden = mongoose.model<IOrden>('Orden', OrdenSchema);
export const DetalleOrden = mongoose.model<IDetalleOrden>('DetalleOrden', DetalleOrdenSchema);
export const Pago = mongoose.model<IPago>('Pago', PagoSchema);
export const Envio = mongoose.model<IEnvio>('Envio', EnvioSchema);
export const Calificacion = mongoose.model<ICalificacion>('Calificacion', CalificacionSchema);
export const Favorito = mongoose.model<IFavorito>('Favorito', FavoritoSchema);
export const HeroSlide = mongoose.model<IHeroSlide>('HeroSlide', HeroSlideSchema);
