using AutoMapper;
using DigitalLibary.Data.Data;
using DigitalLibary.Data.Entity;
using DigitalLibary.Service.Common;
using DigitalLibary.Service.Common.FormatApi;
using DigitalLibary.Service.Dto;
using DigitalLibary.Service.Repository.IRepository;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;



namespace DigitalLibary.Service.Repository.RepositoryIPL
{
    public class UserRepository : IUserRepository
    {
        #region Variables

        private readonly IMapper _mapper;
        public DataContext _DbContext;

        #endregion

        #region Constructors

        public UserRepository(DataContext DbContext, IMapper mapper)
        {
            _DbContext = DbContext;
            _mapper = mapper;
        }

        #endregion

        #region CRUD TABLE USER_TYPE

        public List<UserType> getAllUserType()
        {
            try
            {
                List<UserType> userTypes = new List<UserType>();
                userTypes = _DbContext.UserType.Where(e => e.Id != Guid.Empty).ToList();

                return userTypes;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public UserType getTypeUser(string type)
        {
            UserType userType = null;
            try
            {
                userType = _DbContext.UserType.FirstOrDefault(e => e.TypeName == type);
            }
            catch (Exception)
            {
                throw;
            }

            return userType;
        }

        public UserType getUserType(Guid id)
        {
            UserType unit = null;
            try
            {
                unit = _DbContext.UserType.FirstOrDefault(e => e.Id == id);
            }
            catch (Exception)
            {
                throw;
            }

            return unit;
        }

        #endregion

        #region CRUD TABLE USER_ROLE

        public User_Role getRoleOfUser(Guid Id)
        {
            User_Role role = null;
            try
            {
                role = _DbContext.User_Role.FirstOrDefault(e => e.IdUser == Id.ToString());
            }
            catch (Exception)
            {
                throw;
            }

            return role;
        }

        public User_Role CreateUserRole(User_Role user)
        {
            try
            {
                _DbContext.User_Role.Add(user);
                _DbContext.SaveChanges();
            }
            catch (Exception)
            {
                throw;
            }

            return user;
        }

        public List<User_Role> getListRoleOfUser(Guid Id)
        {
            try
            {
                List<User_Role> Userrole = _DbContext.User_Role.Where(e => e.IdUser == Id.ToString()).ToList();
                return Userrole;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public Response InsertRoleInUserRole(string IdUser, string role)
        {
            Response response = new Response();
            try
            {
                Role roleAdmin = _DbContext.Role.FirstOrDefault(e => e.RoleName == role && e.IsDeleted == false);

                if (roleAdmin != null)
                {
                    User_Role user_Role = new User_Role()
                    {
                        Id = Guid.NewGuid(),
                        IdUser = IdUser,
                        IdRole = roleAdmin.Id.ToString(),
                    };

                    _DbContext.User_Role.Add(user_Role);
                    _DbContext.SaveChanges();

                    response = new Response()
                    {
                        Success = true,
                        Fail = false,
                        Message = "Thêm mới thành công !"
                    };
                    return response;
                }
                else
                {
                    response = new Response()
                    {
                        Success = false,
                        Fail = true,
                        Message = "Không tìm thấy kết quả !"
                    };
                    return response;
                }
            }
            catch (Exception)
            {
                response = new Response()
                {
                    Success = false,
                    Fail = true,
                    Message = "Thêm mới không thành công !"
                };
                return response;
            }
        }

        public Response InsertUser_Role(string IdRole, string IdUser)
        {
            Response response = new Response();
            try
            {
                User_Role user_Role = new User_Role()
                {
                    Id = Guid.NewGuid(),
                    IdUser = IdUser,
                    IdRole = IdRole
                };

                _DbContext.User_Role.Add(user_Role);
                _DbContext.SaveChanges();

                response = new Response()
                {
                    Success = true,
                    Fail = false,
                    Message = "Thêm mới thành công !"
                };
                return response;
            }
            catch (Exception)
            {
                response = new Response()
                {
                    Success = false,
                    Fail = true,
                    Message = "Thêm mới không thành công !"
                };
                return response;
            }
        }

        public Response DeleteUser_Role(string IdUser, string IdRole)
        {
            try
            {
                User_Role user = _DbContext.User_Role.FirstOrDefault(e => e.IdUser == IdUser && e.IdRole == IdRole);
                Response response = new Response();

                if (user != null)
                {
                    _DbContext.User_Role.Remove(user);
                    _DbContext.SaveChanges();

                    response = new Response()
                    {
                        Success = true,
                        Fail = false,
                        Message = "Xóa thành công !"
                    };
                    return response;
                }
                else
                {
                    response = new Response()
                    {
                        Success = false,
                        Fail = true,
                        Message = "Xóa không thành công !"
                    };
                    return response;
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        #endregion

        #region CRUD TABLE ROLE

        public bool ChangePasswordAllUserByListId(List<string> listIdUser, String newPassword)
        {
            try
            {

                var listUserEmails = _DbContext.User
                .Where(u => listIdUser.Contains(u.Id.ToString()))
                .Select(u => u.Email)
                .ToList();

                /*               var listUserEmails = _DbContext.User
                                .Where(u => u.UnitId == Guid.Parse(IdUnit.ToString()))
                                .Select(u => u.Email)
                                .ToList();*/
                if (listUserEmails.Count != 0)
                {
                    foreach (var temp in listUserEmails)
                    {
                        User user = _DbContext.User.FirstOrDefault(e => e.Email == temp);
                        user.Password = newPassword;
                        _DbContext.User.Update(user);
                        _DbContext.SaveChanges();
                    }
                    return true;
                }
                else
                {
                    return false;
                }

            }
            catch
            {
                return false;
            }

        }
        public bool ChangePasswordAllUserByUnit(Guid IdUnit, String newPassword)
        {
            try
            {

                var listUserEmails = _DbContext.User
                .Where(u => u.UnitId == Guid.Parse(IdUnit.ToString()))
                .Select(u => u.Email)
                .ToList();

                foreach (var temp in listUserEmails)
                {
                    User user = _DbContext.User.FirstOrDefault(e => e.Email == temp);
                    user.Password = newPassword;
                    _DbContext.User.Update(user);
                    _DbContext.SaveChanges();
                }
                return true;
            }
            catch
            {
                return false;
            }

        }


        public Role getUserRole(string type)
        {
            Role role = null;
            try
            {
                role = _DbContext.Role.FirstOrDefault(e => e.RoleName == type);
            }
            catch (Exception)
            {
                throw;
            }

            return role;
        }

        public Role getUserRolebyId(Guid Id)
        {
            Role role = null;
            try
            {
                role = _DbContext.Role.FirstOrDefault(e => e.Id == Id);
            }
            catch (Exception)
            {
                throw;
            }

            return role;
        }

        public List<Role> getListUserRolebyId(Guid Id)
        {
            try
            {
                List<Role> role = _DbContext.Role.Where(e => e.Id == Id).ToList();
                return role;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public List<Role> getAllRole()
        {
            try
            {
                var roleList = new List<Role>();
                roleList = _DbContext.Role.Where(e => e.IsDeleted == false).ToList();

                return roleList;
            }
            catch (Exception)
            {
                throw;
            }
        }

        #endregion

        #region CRUD TABLE UNIT

        public Unit getUnit(Guid iD)
        {
            Unit unit = null;
            try
            {
                unit = _DbContext.Unit.FirstOrDefault(e => e.Id == iD);
            }
            catch (Exception)
            {
                throw;
            }

            return unit;
        }

        public Unit getUnit(string type)
        {
            Unit unit = null;
            try
            {
                unit = _DbContext.Unit.FirstOrDefault(e => e.UnitName == type);
            }
            catch (Exception)
            {
                throw;
            }

            return unit;
        }

        public List<Unit> getAllUnit()
        {
            try
            {
                List<Unit> units = new List<Unit>();
                units = _DbContext.Unit.Where(e => e.Id != Guid.Empty).ToList();

                return units;
            }
            catch (Exception)
            {
                throw;
            }
        }

        #endregion

        #region CRUD TABLE USER

        public async Task<Response> UpdateListUserByIdUnit(List<Guid> idUser, Guid idUnit)
        {
            await using var context = _DbContext;
            await using var transaction = await context.Database.BeginTransactionAsync();

            try
            {
                var users = await _DbContext.User.Where(e => idUser.Contains(e.Id)).ToListAsync();

                foreach (var item in users)
                {
                    item.UnitId = idUnit;
                    await context.SaveChangesAsync();
                }

                await transaction.CommitAsync();

                return new Response()
                {
                    Success = true,
                    Fail = false,
                    Message = "Cập nhật thành công !"
                };
            }
            catch
            {
                await transaction.RollbackAsync();
                throw;
            }
        }

        public List<UserDTO> GetListUserByIdUnit(int pageNumber, int pageSize, Guid idUNit)
        {
            var users = _DbContext.User.Where(e => e.UnitId == idUNit && e.IsDeleted == false
            ).ToList();
            if (pageNumber != 0 && pageSize != 0)
            {
                if (pageNumber < 0)
                {
                    pageNumber = 1;
                }

                users = users.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
            }

            var result = _mapper.Map<List<UserDTO>>(users);
            return result;
        }

        public async Task<Response> UpdateDateUser(DateTime activeUser, DateTime expireDayUser, Guid idUnit)
        {
            try
            {
                var user = _DbContext.User.Where(e => e.UnitId == idUnit).ToList();

                if (user.Any())
                {
                    foreach (var t in user)
                    {
                        t.AcitveUser = activeUser;
                        t.ExpireDayUser = expireDayUser;

                        _DbContext.Update(t);
                    }

                    await _DbContext.SaveChangesAsync();
                }

                return new Response()
                {
                    Success = true,
                    Fail = false,
                    Message = "Cập nhật thành công !"
                };
            }
            catch (Exception)
            {
                throw;
            }
        }

        public List<UserDTO> getAllUserNotBlocked(int pageNumber, int pageSize)
        {
            try
            {
                List<User> user = new List<User>();
                if (pageNumber == 0 || pageSize == 0)
                {
                    user = _DbContext.User.Where(e => e.IsDeleted == false
                                                      && e.IsLocked == false && e.IsActive == true &&
                                                      e.ExpireDayUser >= DateTime.Now)
                        .ToList();
                }
                else
                {
                    user = _DbContext.User.Where(e => e.IsDeleted == false
                                                      && e.IsLocked == false && e.IsActive == true &&
                                                      e.ExpireDayUser >= DateTime.Now)
                        .Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
                }

                List<UserDTO> result = new List<UserDTO>();
                result = _mapper.Map<List<UserDTO>>(user);

                return result;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public Response UpdateUser(UserDTO userDTO)
        {
            try
            {
                Response response = new Response();
                User user = new User();
                user = _DbContext.User.Where(e => e.Id == userDTO.Id).FirstOrDefault();
                // Check the USerCode has been exist in the db
                if (userDTO.UserCode != null)
                {
                    var IsExistedUsCode = _DbContext.User.Where(e => e.UserCode == userDTO.UserCode).FirstOrDefault();
                    if (IsExistedUsCode != null && IsExistedUsCode.Id != userDTO.Id)
                    {
                        response = new Response()
                        {
                            Success = false,
                            Fail = true,
                            Message = "Mã người dùng đã tồn tại !"
                        };
                        return response;
                    }
                }

                if (user != null)
                {
                    user.Fullname = String.IsNullOrEmpty(userDTO.Fullname) ? user.Fullname : userDTO.Fullname;
                    user.Password = String.IsNullOrEmpty(userDTO.Password) ? user.Password : userDTO.Password;
                    user.Email = String.IsNullOrEmpty(userDTO.Email) ? user.Email : userDTO.Email;

                    user.Description = userDTO.Description;
                    user.Address = userDTO.Address;
                    user.Phone = userDTO.Phone;

                    user.UserTypeId = userDTO.UserTypeId;
                    user.Status = userDTO.Status.HasValue ? userDTO.Status : user.Status;
                    user.CreatedDate = userDTO.CreatedDate.HasValue ? userDTO.CreatedDate : user.CreatedDate;
                    user.UserCode = String.IsNullOrEmpty(userDTO.UserCode) ? user.UserCode : userDTO.UserCode;
                    user.UnitId = userDTO.UnitId;
                    user.CreatedBy = userDTO.CreatedBy.HasValue ? userDTO.CreatedBy : user.CreatedBy;
                    user.ActiveCode = String.IsNullOrEmpty(userDTO.ActiveCode) ? user.ActiveCode : userDTO.ActiveCode;
                    user.AcitveUser = userDTO.AcitveUser.HasValue ? userDTO.AcitveUser : user.AcitveUser;
                    user.ExpireDayUser = userDTO.ExpireDayUser.HasValue ? userDTO.ExpireDayUser : user.ExpireDayUser;

                    //check id file exits
                    if (userDTO.idFile is null)
                    {
                        if (userDTO.Avatar is null) user.Avatar = null;
                        if (userDTO.Avatar is not null) user.Avatar = userDTO.Avatar;
                    }
                    //user.Avatar = user.Avatar;


                    _DbContext.Update(user);
                    _DbContext.SaveChanges();

                    response = new Response()
                    {
                        Success = true,
                        Fail = false,
                        Message = "Cập nhật thành công !"
                    };
                    return response;
                }
                else
                {
                    response = new Response()
                    {
                        Success = false,
                        Fail = true,
                        Message = "Cập nhật không thành công !"
                    };
                    return response;
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        public Response InsertUser(UserDTO userDTO)
        {
            Response response = new Response();
            try
            {
                var user = _mapper.Map<User>(userDTO);

                _DbContext.User.Add(user);
                _DbContext.SaveChanges();

                response = new Response()
                {
                    Success = true,
                    Fail = false,
                    Message = "Thêm mới thành công !"
                };
                return response;
            }
            catch (Exception exception)
            {
                response = new Response()
                {
                    Success = false,
                    Fail = true,
                    Message = "Thêm mới không thành công !"
                };
                return response;
            }
        }

        public List<UserDTO> getAllUser(int pageNumber, int pageSize)
        {
            try
            {
                var user = new List<User>();
                if (pageNumber == 0 || pageSize == 0)
                {
                    user = _DbContext.User.Where(e => e.IsDeleted == false)
                        .OrderByDescending(e => e.CreatedDate)
                        .ToList();
                }
                else
                {
                    user = _DbContext.User.Where(e => e.IsDeleted == false)
                        .OrderByDescending(e => e.CreatedDate)
                        .Skip((pageNumber - 1) * pageSize).Take(pageSize).ToList();
                }

                var result = _mapper.Map<List<UserDTO>>(user);

                return result;
            }
            catch (Exception)
            {
                throw;
            }
        }
        public List<UserDTO> getAllUsersNotInDocumentInvoice(int pageNumber, int pageSize)
        {
            try
            {
                var user = new List<User>();
                if (pageNumber == 0 || pageSize == 0)
                {
                     user = _DbContext.User
                            .Where(u => u.IsDeleted == false &&
                                        _DbContext.DocumentInvoice.Any(di => di.UserId == u.Id))
                            .OrderByDescending(u => u.CreatedDate)
                            .ToList();
                }
                else
                {
                    user = _DbContext.User
                        .Where(u => u.IsDeleted == false &&
                                    _DbContext.DocumentInvoice.Any(di => di.UserId == u.Id))
                        .OrderByDescending(u => u.CreatedDate)
                        .Skip((pageNumber - 1) * pageSize)
                        .Take(pageSize)
                        .ToList();
                }

                var result = _mapper.Map<List<UserDTO>>(user);

                return result;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public User CreateUser(User userInfor)
        {
            try
            {
                _DbContext.User.Add(userInfor);
                _DbContext.SaveChanges();
            }
            catch (Exception)
            {
                throw;
            }

            return userInfor;
        }

        public User getUserByEmail(string email)
        {
            try
            {
                var result = _DbContext.User.FirstOrDefault(e => e.Email == email);
                return result;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<Response> RemoveUser(Guid Id)
        {
            try
            {
                var documentInvoice = _DbContext.DocumentInvoice.FirstOrDefault(e => e.UserId == Id
                    && e.Status == 0);
                if (documentInvoice != null)
                {
                    return new Response()
                    {
                        Success = false,
                        Fail = true,
                        Message = "Người dùng này hiện đang mượn sách không thể xóa !"
                    };
                }

                var userEntity = _DbContext.User.FirstOrDefault(e => e.Id == Id);
                if (userEntity != null)
                {
                    var user_Delete = new User_Delete();
                    user_Delete = _mapper.Map<User_Delete>(userEntity);
                    user_Delete.IsDeleted = true;
                    _DbContext.User_Delete.Add(user_Delete);

                    _DbContext.User.Remove(userEntity);
                    await _DbContext.SaveChangesAsync();
                }

                return new Response()
                {
                    Success = true,
                    Fail = false,
                    Message = "Xóa thành công !"
                };
            }
            catch (Exception)
            {
                return new Response()
                {
                    Success = false,
                    Fail = true,
                    Message = "Xóa không thành công !"
                };
            }
        }

        public async Task<Response> ActiveUserByCode(string email, string code)
        {
            try
            {
                var userEntity = _DbContext.User.FirstOrDefault(e => e.Email == email);
                if (userEntity != null && userEntity.ActiveCode == code)
                {
                    userEntity.IsActive = true;
                    _DbContext.User.Update(userEntity);
                    await _DbContext.SaveChangesAsync();
                }

                return new Response()
                {
                    Success = true,
                    Fail = false,
                    Message = "Cập nhật thành công !"
                };
            }
            catch (Exception)
            {
                return new Response()
                {
                    Success = false,
                    Fail = true,
                    Message = "Cập nhật không thành công !"
                };
            }
        }

        public Response UpdateActiveCode(string code, string email)
        {
            try
            {
                User user = _DbContext.User.FirstOrDefault(e => e.Email == email);
                Response response = new Response();

                if (user != null)
                {
                    user.ActiveCode = code;
                    _DbContext.User.Update(user);
                    _DbContext.SaveChanges();

                    response = new Response()
                    {
                        Success = true,
                        Fail = false,
                        Message = "Cập nhật thành công !"
                    };
                    return response;
                }
                else
                {
                    response = new Response()
                    {
                        Success = false,
                        Fail = true,
                        Message = "Cập nhật không thành công !"
                    };
                    return response;
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        public Response UpdatePassword(string email, string newPassword)
        {
            try
            {
                User user = _DbContext.User.FirstOrDefault(e => e.Email == email);
                Response response = new Response();

                if (user != null)
                {
                    user.Password = newPassword;
                    _DbContext.User.Update(user);
                    _DbContext.SaveChanges();

                    response = new Response()
                    {
                        Success = true,
                        Fail = false,
                        Message = "Cập nhật thành công !"
                    };
                    return response;
                }
                else
                {
                    response = new Response()
                    {
                        Success = false,
                        Fail = true,
                        Message = "Cập nhật không thành công !"
                    };
                    return response;
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<Response> ActiveUser(UserDTO userInfor)
        {
            Response status = new Response();
            try
            {
                User userEntity = _DbContext.User.FirstOrDefault(e => e.Email == userInfor.Email);
                if (userEntity != null)
                {
                    userEntity.IsActive = true;
                    _DbContext.User.Update(userEntity);
                    await _DbContext.SaveChangesAsync();
                }
            }
            catch (Exception)
            {
                status = new Response()
                {
                    Success = false,
                    Fail = true,
                    Message = "Cập nhật không thành công !"
                };
                return status;
            }

            status = new Response()
            {
                Success = true,
                Fail = false,
                Message = "Cập nhật thành công !"
            };
            return status;
        }

        public async Task<Response> LockAccountUser(Guid Id, bool isLock)
        {
            Response status = new Response();
            try
            {
                User userEntity = _DbContext.User.FirstOrDefault(e => e.Id == Id);
                if (userEntity != null)
                {
                    userEntity.IsLocked = isLock;
                    _DbContext.User.Update(userEntity);
                    await _DbContext.SaveChangesAsync();
                }
            }
            catch (Exception)
            {
                status = new Response()
                {
                    Success = false,
                    Fail = true,
                    Message = "Khóa không thành công !"
                };
                return status;
            }

            status = new Response()
            {
                Success = true,
                Fail = false,
                Message = "Khóa tài khoản thành công !"
            };
            return status;
        }

        public UserDTO getUserByID(Guid Id)
        {
            try
            {
                User user = _DbContext.User.FirstOrDefault(e => e.Id == Id);
                UserDTO userDTO = new UserDTO();
                userDTO = _mapper.Map<UserDTO>(user);
                return userDTO;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public int GetMaxUnitCode(string code, Guid IdUser)
        {
            try
            {
                int UnitCodeMax = 0;

                List<User> users = _DbContext.User
                    .Where(x => x.UserCode.Substring(0, code.Length).ToLower() == code.ToLower()).ToList();

                for (int i = 0; i < users.Count; i++)
                {
                    if (users[i].UserCode.Length <= code.Length) continue;

                    string number = users[i].UserCode.Substring(code.Length);
                    int numberInt = int.Parse(number);

                    if (UnitCodeMax < numberInt)
                    {
                        UnitCodeMax = numberInt;
                    }
                }

                return UnitCodeMax;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public List<UserDTO> getAllUser(SortAndSearchListUsser sortAndSearchListUsser)
        {
            try
            {
                List<User> user = new List<User>();
                int countRecord = 0;
                //hùng bỏ đk này && e.Email != "admin@gmail.com"
                user = _DbContext.User.Where(e => e.IsDeleted == false )
                    .OrderByDescending(e => e.CreatedDate)
                    .ToList();

                countRecord = user.Count();

                if (sortAndSearchListUsser.Fullname != null)
                {
                    user = user.Where(a => a.Fullname.ToLower()
                        .Contains(sortAndSearchListUsser.Fullname[0].ToLower())).ToList();
                    countRecord = user.Count();
                }

                if (sortAndSearchListUsser.Email != null)
                {
                    user = user.Where(a => a.Email.ToLower()
                        .Contains(sortAndSearchListUsser.Email[0].ToLower())).ToList();
                    countRecord = user.Count();
                }

                if (sortAndSearchListUsser.Phone != null)
                {
                    user = user.Where(a =>
                        a.Phone != null).ToList();

                    user = user.Where(a => a.Phone.ToLower()
                        .Contains(sortAndSearchListUsser.Phone[0].ToLower())).ToList();

                    countRecord = user.Count();
                }

                if (sortAndSearchListUsser.Address != null)
                {
                    user = user.Where(a =>
                        a.Address != null).ToList();

                    user = user.Where(a => a.Address.ToLower()
                        .Contains(sortAndSearchListUsser.Address[0].ToLower())).ToList();

                    countRecord = user.Count();
                }

                if (sortAndSearchListUsser.userTypeId != null)
                {
                    //for (int i = 0; i < sortAndSearchListUsser.userTypeId.Count; i++)
                    //{
                    //    user = user.Where(a => a.UserTypeId == sortAndSearchListUsser.userTypeId[i]).ToList();
                    //}
                    user = user.Where(a => sortAndSearchListUsser.userTypeId.Contains(a.UserTypeId)).ToList();
                    countRecord = user.Count();
                }

                if (sortAndSearchListUsser.unitId != null)
                {
                    //for (int i = 0; i < sortAndSearchListUsser.unitId.Count; i++)
                    //{
                    //    user = user.Where(a => a.UnitId == sortAndSearchListUsser.unitId[i]).ToList();
                    //}
                    user = user.Where(a => sortAndSearchListUsser.unitId.Contains(a.UnitId)).ToList();
                    countRecord = user.Count();
                }

                if (sortAndSearchListUsser.sortOrder == "ascend")
                {
                    if (sortAndSearchListUsser.sortField == "createdDate")
                    {
                        if (user.Count == 0)
                        {
                            user = user
                                .OrderBy(e => e.CreatedDate)
                                .ToList();
                        }
                    }
                }
                else
                {
                    if (sortAndSearchListUsser.sortField == "createdDate")
                    {
                        if (user.Count == 0)
                        {
                            user = user
                                .OrderByDescending(e => e.CreatedDate)
                                .ToList();
                        }
                    }
                }

                List<UserDTO> result = new List<UserDTO>();
                result = _mapper.Map<List<UserDTO>>(user);

                result.ForEach(r => r.Password = "");

                if (sortAndSearchListUsser.page != 0 && sortAndSearchListUsser.results != 0)
                {
                    if (sortAndSearchListUsser.page < 0)
                    {
                        sortAndSearchListUsser.page = 1;
                    }

                    result = result.Skip((sortAndSearchListUsser.page - 1) * sortAndSearchListUsser.results)
                        .Take(sortAndSearchListUsser.results).ToList();
                }

                if (result.Any())
                {
                    result[0].total = countRecord;
                }


                return result;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public List<UserDTO> getAllUserByIdUnit(Guid IdUnit)
        {
            try
            {
                var users = _DbContext.User.Where(e => e.IsDeleted == false && e.UnitId == IdUnit).ToList();
                var result = _mapper.Map<List<UserDTO>>(users);
                result.ForEach(e => e.Password = "");

                return result;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<Response> UpdateActiveAndExpireDateUser(UserDTO userDTOs)
        {
            try
            {
                User user = await _DbContext.User.Where(e => e.Email == userDTOs.Email).FirstOrDefaultAsync();
                Response response = new Response();

                if (user != null)
                {
                    user.AcitveUser = userDTOs.AcitveUser;
                    user.ExpireDayUser = userDTOs.ExpireDayUser;

                    _DbContext.User.Update(user);
                    await _DbContext.SaveChangesAsync();

                    response = new Response()
                    {
                        Success = true,
                        Fail = false,
                        Message = "Cập nhật thành công !"
                    };
                    return response;
                }
                else
                {
                    response = new Response()
                    {
                        Success = false,
                        Fail = true,
                        Message = "Cập nhật không thành công !"
                    };
                    return response;
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<Response> UpdateImageUsers(string lstIdUser, string IdImage)
        {
            using var context = _DbContext;
            using var transaction = context.Database.BeginTransaction();
            Response response = new Response();

            try
            {
                var userId = lstIdUser.Split(',');
                for (int i = 0; i < userId.Count(); i++)
                {
                    User user = await _DbContext.User.Where(e => e.Id == new Guid(userId[i])).FirstOrDefaultAsync();

                    if (user != null)
                    {
                        user.Avatar = IdImage;

                        _DbContext.User.Update(user);
                        await _DbContext.SaveChangesAsync();
                    }
                    else
                    {
                        transaction.Rollback();
                        response = new Response()
                        {
                            Success = false,
                            Fail = true,
                            Message = "Đã có ID không tồn tại !"
                        };
                        return response;
                    }
                }

                transaction.Commit();

                response = new Response()
                {
                    Success = true,
                    Fail = false,
                    Message = "Cập nhật thành công !"
                };
                return response;
            }
            catch (Exception)
            {
                transaction.Rollback();
                throw;
            }
        }

        public string NameFileAvatarUser(Guid Id)
        {
            try
            {
                User user = _DbContext.User.Where(e => e.Id == Id).FirstOrDefault();
                if (user != null)
                    return user.Avatar;
                else
                    return null;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public List<MutiplePrintLibraryCard> mutiplePrintLibraryCards(List<Guid> IdUsers)
        {
            try
            {
                var datas = (from a in _DbContext.User
                             join b in _DbContext.Unit on a.UnitId equals b.Id
                             where IdUsers.Contains(a.Id)
                             select new MutiplePrintLibraryCard
                             {
                                 Id = a.Id,
                                 UnitName = b.UnitName,
                                 FullName = a.Fullname,
                                 UserCode = a.UserCode,
                                 Avatar = a.Avatar,
                                 CreatedDate = a.CreatedDate
                             }).ToList();

                return datas;
            }
            catch (Exception)
            {
                throw;
            }
        }

        #endregion
    }
}